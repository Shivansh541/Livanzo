import React, { useEffect, useState } from 'react'
import { useTheme } from '../../content/ThemeContext'

const Logo = () => {
const { theme } = useTheme()
  return (
    <img src={`/logo ${theme}.png`} alt="logo"/>
  )
}

export default Logo
