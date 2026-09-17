import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../../components/layout/Navbar'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/useAuthStore'
import { useT } from '../../i18n'

export default function PartnerRequest() {
  const navigate = useNavigate()
  const session = useAuthStore((state) => state.session)
  const { t } = useT()
  const [businessName, setBusinessName] = useState('')
  const [contact, setContact] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  async function submit(event) {
    event.preventDefault()
    if (!businessName.trim() || !contact.trim() || !message.trim()) return
    setSending(true)
    const { error } = await supabase.from('partner_requests').insert({
      user_id: session.user.id,
      business_name: businessName.trim(),
      contact: contact.trim(),
      message: message.trim(),
    })
    setSending(false)
    if (error) {
      toast.error(t('partner.error'))
      return
    }
    toast.success(t('partner.sent'))
    navigate('/cuenta')
  }

  return (
    <div className="container-app">
      <Navbar title={t('partner.title')} back />
      <form onSubmit={submit} className="px-4 py-4 space-y-4">
        <p className="text-sm text-ink-soft">{t('partner.description')}</p>
        <input
          className="input-field"
          placeholder={t('partner.businessPlaceholder')}
          value={businessName}
          onChange={(event) => setBusinessName(event.target.value)}
          required
        />
        <input
          className="input-field"
          placeholder={t('partner.contactPlaceholder')}
          value={contact}
          onChange={(event) => setContact(event.target.value)}
          required
        />
        <textarea
          className="input-field"
          rows={5}
          placeholder={t('partner.messagePlaceholder')}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={2000}
          required
        />
        <button type="submit" disabled={sending} className="btn-accent w-full">
          {sending ? t('partner.sending') : t('partner.send')}
        </button>
      </form>

      <section className="px-4 pb-8">
        <div className="card p-4">
          <h2 className="font-display font-bold text-lg">{t('partner.whatWeOffer')}</h2>
          <ul className="mt-3 space-y-3 text-sm text-ink-soft">
            <li>✓ {t('partner.offer1')}</li>
            <li>✓ {t('partner.offer2')}</li>
            <li>✓ {t('partner.offer3')}</li>
            <li>✓ {t('partner.offer4')}</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
