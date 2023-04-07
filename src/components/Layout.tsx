import { CookieModal } from '@/components/CookiesManager';
import TopBar from '@/components/TopBar';

export default function Layout({ children } : any) {
  return (
    <>
      <TopBar/>
      <CookieModal/>
      <main>{children}</main>
    </>
  )
}