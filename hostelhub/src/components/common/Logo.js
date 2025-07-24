import React from 'react'
import { useTheme } from '../../context/ThemeContext'

const Logo = () => {
const { theme } = useTheme()
  return (
    <img src={`/logo ${theme}.png`} alt="logo"/>
  )
}

export default Logo
