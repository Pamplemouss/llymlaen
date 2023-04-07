import CookiePopup from '@/components/CookiePopup';
import TopBar from '@/components/TopBar';

export default function Layout({ children } : any) {
  return (
    <>
      <TopBar></TopBar>
      <CookiePopup></CookiePopup>
      <main>{children}</main>
    </>
  )
}