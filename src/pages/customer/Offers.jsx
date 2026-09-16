import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import StoreRail from '../../components/home/StoreRail'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import ScrollTopPill from '../../components/layout/ScrollTopPill'
import { useT } from '../../i18n'
import BuildingPromotion from '../../components/home/BuildingPromotion'
import { NEO_LOFTS_PROMOTION } from '../../data/buildingPromotions'

export default function Offers() {
  const { t } = useT()
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('stores')
        .select('*')
        .order('rating', { ascending: false })
      setStores(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const freeDelivery = stores.filter((s) => s.free_delivery)
  const withPromo = stores.filter((s) => s.promo_label && !s.free_delivery)
  const fastest = [...stores].sort((a, b) => (a.eta_minutes || 99) - (b.eta_minutes || 99)).slice(0, 10)
  const hasOffers = freeDelivery.length > 0 || withPromo.length > 0

  return (
    <div className="container-app">
      <ScrollTopPill />

      <h1 className="screen-title text-[#0A84FF] px-4 pt-5 pb-6">{t('offers.title')}</h1>

      <BuildingPromotion building={NEO_LOFTS_PROMOTION} />

      {loading && <Spinner className="py-10" />}

      {!loading && !hasOffers && (
        <EmptyState
          title={t('offers.empty')}
          description={t('offers.emptyDesc')}
        />
      )}

      <StoreRail
        title={t('offers.freeShipping')}
        moreTo="/categoria/comida"
        stores={freeDelivery}
      />
      <StoreRail title={t('offers.discounts')} stores={withPromo} />
      {!loading && <StoreRail title={t('offers.fastest')} stores={fastest} />}
    </div>
  )
}
