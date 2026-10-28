import { useCallback, useState } from 'react'
import { Divider } from 'primereact/divider'
import NavBar from '../Composants/nav'
import Footer from '../Composants/Footer'
import { useAuth } from '../../context/AuthContext.jsx'
import { useSpaceRequest } from '../../hooks/useSpaceRequest.js'
import PendingRequestBanner from './home/PendingRequestBanner.jsx'
import HomeHero from './home/HomeHero.jsx'
import HomeTrustStrip from './home/HomeTrustStrip.jsx'
import HomeValues from './home/HomeValues.jsx'
import HomeCatalog from './home/HomeCatalog.jsx'
import HomeShops from './home/HomeShops.jsx'
import HomeAbout from './home/HomeAbout.jsx'
import HomeTestimonials from './home/HomeTestimonials.jsx'
import HomeCta from './home/HomeCta.jsx'
import HomeContact from './home/HomeContact.jsx'
import useHomeCatalog from './home/useHomeCatalog.js'

export default function Home() {
  const { user } = useAuth()
  // Le backend renvoie "seller", le mock de session utilise "merchant".
  const isMerchant = user?.role === 'seller' || user?.role === 'merchant'
  const { isSellerByRequest, hasOpenRequest, status } = useSpaceRequest(user)
  const catalog = useHomeCatalog()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [pendingBannerHeight, setPendingBannerHeight] = useState(0)

  const handleBannerHeight = useCallback((height) => setPendingBannerHeight(height), [])
  const showPendingBanner = status === 'pending'
  // La validation fait basculer l'utilisateur en « seller » côté backend. Tant
  // que la session locale n'est pas rafraîchie, on déduit le statut vendeur de
  // la demande.
  const showSeller = isMerchant || isSellerByRequest

  return (
    <div className="min-h-screen bg-base-100">
      <NavBar
        mobileOpen={mobileNavOpen}
        onToggleMobile={() => setMobileNavOpen((open) => !open)}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      <PendingRequestBanner status={status} onHeightChange={handleBannerHeight} />

      <main
        onClick={() => setMobileNavOpen(false)}
        className={mobileNavOpen ? 'blur-sm lg:blur-none' : ''}
      >
        <HomeHero
          pendingHeight={pendingBannerHeight}
          showPendingBanner={showPendingBanner}
          showSeller={showSeller}
          hasOpenRequest={hasOpenRequest}
        />
        <HomeTrustStrip />
        <HomeValues />
        <Divider />
        <HomeCatalog catalog={catalog} />
        <HomeShops
          shops={catalog.shops}
          loading={catalog.shopsLoading}
          loadError={catalog.shopsError}
        />
        <HomeAbout />
        <HomeTestimonials />
        <HomeCta />
        <HomeContact />
      </main>

      <Footer />
    </div>
  )
}
