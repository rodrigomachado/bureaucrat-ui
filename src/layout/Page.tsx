import React from "react"
import './Page.css'

type PageProps = {
  children: React.ReactNode,
}
const Page = ({ children }: PageProps) => {
  return (
    <>
      {children}
    </>
  )
}

export default Page
