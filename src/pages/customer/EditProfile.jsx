import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/useAuthStore'
import { IconChevronLeft, IconClose, IconLock, IconCamera } from '../../components/ui/Icon'
import AppIcon from '../../components/ui/AppIcon'
import { useT } from '../../i18n'

// Campos que viven en columnas opcionales de `profiles`
// (las agrega supabase/migrations/002_perfil_y_favoritos.sql).
const OPTIONAL_FIELDS = ['nickname', 'social_id', 'birth_date', 'city']

function Field({ label, value, onChange, placeholder, type = 'text', disabled, hint, locked }) {
  const { t } = useT()
  return (
    <div className="mb-5">
      <label className={`block text-[15px] mb-2 ${disabled ? 'text-ink-faint' : 'text-ink'}`}>
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-xl border px-4 py-3.5 text-[16px] outline-none transition ${
            disabled
              ? 'bg-base-muted border-base-line text-ink-faint'
              : 'bg-base border-base-line text-ink focus:border-ink'
          }`}
        />
        {locked && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-faint">
            <AppIcon path="ui/candado" fallback={IconLock} size={18} />
          </span>
        )}
        {!disabled && !locked && value && (
          <button
            type="button"
            aria-label={t('common.clearField', { field: label })}
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-base-muted text-ink-soft flex items-center justify-center"
          >
            <IconClose size={13} />
          </button>
        )}
      </div>
      {hint && <p className="text-[13px] text-teal-400 mt-1.5">{hint}</p>}
    </div>
  )
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const image = new Image()
      image.onload = () => {
        const scale = Math.min(1, 512 / Math.max(image.width, image.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(image.width * scale))
        canvas.height = Math.max(1, Math.round(image.height * scale))
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      }
      image.onerror = reject
      image.src = reader.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function EditProfile() {
  const navigate = useNavigate()
  const { t } = useT()
  const { profile, session, fetchProfile } = useAuthStore()
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const imageInputRef = useRef(null)

  const initial = useMemo(() => {
    const parts = (profile?.full_name || '').trim().split(/\s+/)
    return {
      nickname: profile?.nickname || '',
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || '',
      social_id: profile?.social_id || '',
      phone: profile?.phone || '',
      birth_date: profile?.birth_date || '',
      address: profile?.address || '',
      city: profile?.city || '',
    }
  }, [profile])

  const [form, setForm] = useState(initial)
  useEffect(() => setForm(initial), [initial])

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }))

  const dirty = JSON.stringify(form) !== JSON.stringify(initial)
  const valid = form.firstName.trim() && form.lastName.trim()

  const handleSave = async () => {
    if (!dirty || !valid || !profile) return
    setSaving(true)

    const payload = {
      full_name: `${form.firstName.trim()} ${form.lastName.trim()}`,
      phone: form.phone.trim() || null,
      address: form.address.trim() || null,
      nickname: form.nickname.trim() || null,
      social_id: form.social_id.trim() || null,
      birth_date: form.birth_date || null,
      city: form.city.trim() || null,
    }

    // Solo mandamos las columnas que realmente existen en la tabla, así la
    // pantalla funciona aunque todavía no se haya corrido la migración 002.
    const existing = Object.keys(profile)
    const supported = {}
    const missing = []
    for (const [key, value] of Object.entries(payload)) {
      if (existing.includes(key)) supported[key] = value
      else if (OPTIONAL_FIELDS.includes(key)) missing.push(key)
    }

    const { error } = await supabase.from('profiles').update(supported).eq('id', profile.id)
    setSaving(false)

    if (error) {
      toast.error(t('profile.saveError'))
      return
    }

    await fetchProfile(profile.id)
    if (missing.length) {
      toast(t('profile.missingColumns', { fields: missing.join(', ') }))
    } else {
      toast.success(t('profile.saved'))
    }
  }

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !profile) return

    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      toast.error(t('profile.imageInvalid'))
      return
    }

    setUploadingImage(true)
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `${profile.id}/avatar.${extension}`
    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type,
    })

    let avatarUrl
    if (!uploadError) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      avatarUrl = `${data.publicUrl}?v=${Date.now()}`
    } else {
      try {
        avatarUrl = await compressImage(file)
      } catch {
        setUploadingImage(false)
        toast.error(t('profile.imageError'))
        return
      }
    }

    let { error: profileError } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', profile.id)

    if (profileError && !uploadError) {
      try {
        avatarUrl = await compressImage(file)
        const result = await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('id', profile.id)
        profileError = result.error
      } catch {
        profileError = { message: 'avatar fallback failed' }
      }
    }
    setUploadingImage(false)

    if (profileError) {
      toast.error(t('profile.imageError'))
      return
    }

    await fetchProfile(profile.id)
    toast.success(t('profile.imageSaved'))
  }

  const initialsText = (profile?.full_name || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('')

  return (
    <div className="container-app pb-40">
      <header className="flex items-center gap-3 px-4 pt-4 pb-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label={t('common.back')}
          className="h-10 w-10 rounded-full bg-base-muted flex items-center justify-center text-ink"
        >
          <AppIcon path="ui/volver" fallback={IconChevronLeft} size={20} />
        </button>
        <h1 className="font-display font-bold text-[20px]">{t('profile.title')}</h1>
      </header>

      <div className="flex flex-col items-center py-6">
        <div className="h-[104px] w-[104px] rounded-full bg-base-muted overflow-hidden flex items-center justify-center font-display font-bold text-[28px] text-ink-soft">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.full_name} className="h-full w-full object-cover" />
          ) : (
            initialsText || '—'
          )}
        </div>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          disabled={uploadingImage}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-base-line px-5 py-2.5 text-[15px] font-medium text-ink"
        >
          <AppIcon path="ui/camara" fallback={IconCamera} size={17} />
          {uploadingImage ? t('profile.uploadingImage') : t('profile.editImage')}
        </button>
      </div>

      <div className="px-4">
        <Field
          label={t('profile.nickname')}
          value={form.nickname}
          onChange={set('nickname')}
          placeholder={t('profile.nicknamePlaceholder')}
        />
        <Field label={t('profile.firstName')} value={form.firstName} onChange={set('firstName')} />
        <Field label={t('profile.lastName')} value={form.lastName} onChange={set('lastName')} />
        <Field
          label={t('profile.socialId')}
          value={form.social_id}
          onChange={set('social_id')}
          placeholder={t('profile.socialIdPlaceholder')}
        />
        <Field
          label={t('profile.email')}
          value={session?.user?.email || ''}
          onChange={() => {}}
          disabled
          locked
          hint={session?.user?.email_confirmed_at ? t('profile.emailVerified') : undefined}
        />
        <Field
          label={t('profile.phone')}
          value={form.phone}
          onChange={set('phone')}
          type="tel"
          placeholder="+54 351 000 0000"
        />
        <Field
          label={t('profile.birthDate')}
          value={form.birth_date}
          onChange={set('birth_date')}
          type="date"
        />
        <Field
          label={t('profile.address')}
          value={form.address}
          onChange={set('address')}
          placeholder={t('profile.addressPlaceholder')}
        />
        <Field label={t('profile.city')} value={form.city} onChange={set('city')} placeholder="Miami" />
      </div>

      {/* Guardar sticky, deshabilitado hasta que haya cambios */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <div className="ancho-app bg-base px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] border-t border-base-line">
          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty || !valid || saving}
            className={
              dirty && valid && !saving
                ? 'w-full rounded-2xl py-4 font-semibold text-[16px] bg-mango-500 text-white transition'
                : 'w-full rounded-2xl py-4 font-semibold text-[16px] bg-base-muted text-ink-faint cursor-not-allowed transition'
            }
          >
            {saving ? t('common.saving') : t('common.save')}
          </button>
        </div>
      </div>
    </div>
  )
}
