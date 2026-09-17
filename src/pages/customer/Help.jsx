import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../../components/layout/Navbar'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/useAuthStore'
import { useT } from '../../i18n'

// Estados que puede tener una consulta según la tabla support_requests.
const ESTADOS = {
  pendiente: 'help.statusPending',
  en_revision: 'help.statusInReview',
  resuelto: 'help.statusSolved',
}

export default function Help() {
  const navigate = useNavigate()
  const session = useAuthStore((state) => state.session)
  const { t } = useT()
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [previas, setPrevias] = useState([])

  // Consultas anteriores del usuario, para que vea en qué anda cada una.
  useEffect(() => {
    if (!session) return
    supabase
      .from('support_requests')
      .select('id, subject, message, status, admin_notes, created_at')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data }) => setPrevias(data || []))
  }, [session])

  async function submit(event) {
    event.preventDefault()
    if (!subject.trim() || !message.trim()) return
    setSending(true)
    const { error } = await supabase.from('support_requests').insert({
      user_id: session.user.id,
      subject: subject.trim(),
      message: message.trim(),
    })
    setSending(false)
    if (error) {
      toast.error(t('help.error'))
      return
    }
    toast.success(t('help.sent'))
    navigate('/cuenta')
  }

  return (
    <div className="container-app">
      <Navbar title={t('help.title')} back />
      <form onSubmit={submit} className="px-4 py-4 space-y-4">
        <p className="text-sm text-ink-soft">{t('help.description')}</p>
        <input
          className="input-field"
          placeholder={t('help.subjectPlaceholder')}
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          maxLength={120}
          required
        />
        <textarea
          className="input-field"
          rows={7}
          placeholder={t('help.messagePlaceholder')}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={2000}
          required
        />
        <button type="submit" disabled={sending} className="btn-accent w-full">
          {sending ? t('help.sending') : t('help.send')}
        </button>
        <p className="text-xs text-ink-faint text-center">{t('help.reviewNote')}</p>
      </form>

      {previas.length > 0 && (
        <section className="px-4 pb-6">
          <h2 className="section-title mb-2">{t('help.myRequests')}</h2>
          <div className="space-y-2">
            {previas.map((consulta) => (
              <article key={consulta.id} className="card p-4">
                <div className="flex justify-between gap-3">
                  <p className="font-semibold text-sm">{consulta.subject}</p>
                  <span className="text-xs bg-base-muted rounded-full px-2 py-1 flex-shrink-0 h-fit">
                    {t(ESTADOS[consulta.status] || 'help.statusPending')}
                  </span>
                </div>
                <p className="text-sm text-ink-soft mt-2 whitespace-pre-wrap">{consulta.message}</p>
                {consulta.admin_notes && (
                  <p className="text-sm text-ink mt-3 rounded-xl bg-base-muted p-3">
                    <span className="font-semibold">{t('help.adminReply')}: </span>
                    {consulta.admin_notes}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
