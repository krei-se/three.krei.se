import kreiseLogo from './kreise.svg'
// import derchemnitzLogo from '.derchemnitz.svg'

export function getPageOverlayDiv (): HTMLDivElement {

  const pageOverlayDiv: HTMLDivElement = document.createElement('div')
  pageOverlayDiv.setAttribute('id', 'pageOverlay')

  const introDiv: HTMLDivElement = document.createElement('div')
  introDiv.setAttribute('id', 'introDiv')
  pageOverlayDiv.append(introDiv)

  const logoLink: HTMLAnchorElement = document.createElement('a')
  logoLink.setAttribute('href', 'https://krei.se')

  introDiv.append(logoLink)

  const logoImg: HTMLImageElement = document.createElement('img')
  logoImg.setAttribute('src', kreiseLogo)
  logoImg.setAttribute('alt', 'Krei.se Logo')

  logoImg.classList.add('kreiseLogo')
  logoImg.classList.add('vanilla')
  introDiv.classList.add('applyInvertFilter')
  

  introDiv.append(logoImg)

  const infoParagraph: HTMLParagraphElement = document.createElement('p')
  infoParagraph.setAttribute('id', 'info')
  infoParagraph.classList.add('applyFadeOut')

  // const cycleGraphLink: HTMLAnchorElement = document.createElement('a')
  // cycleGraphLink.setAttribute('href', 'cycleGraph.html')
  // cycleGraphLink.innerHTML = 'L&ouml;sung zyklische Graphen'
  // infoParagraph.append(cycleGraphLink)

  const datenschutzParagraph: HTMLParagraphElement = document.createElement('p')
  datenschutzParagraph.setAttribute('id', 'datenschutz')
  datenschutzParagraph.style.fontWeight = '400'
  datenschutzParagraph.classList.add('applyFadeOut')

  const datenschutzLink: HTMLAnchorElement = document.createElement('a')
  datenschutzLink.setAttribute('href', 'datenschutz.html')
  datenschutzLink.innerHTML = 'Impressum · Datenschutz'

  datenschutzParagraph.append(datenschutzLink)

  introDiv.append(datenschutzParagraph)
  introDiv.append(infoParagraph)

  return pageOverlayDiv
}

export function getVersionDiv (): HTMLDivElement {

  let vDiv = document.createElement('div')
  vDiv.id = 'vDiv'

  vDiv.classList.add('applyInvertFilter')
  vDiv.classList.add('applyFadeOut')
  

  const vParagraph = document.createElement('p');
  vParagraph.style.cssText = 'vertical-align: middle;'
  vParagraph.innerHTML = '<a href="https://github.com/krei-se/three.krei.se"><img src="/github-mark.svg" width="50" height="auto"/> Krei.se ' + import.meta.env.PACKAGE_VERSION + '</a>'
  
  vDiv.append(vParagraph)
  vDiv.style.cssText = 'vertical-align: middle; font-size: 10pt; position: fixed; bottom: 0; left: 1em;'

  return vDiv

}

export function getSocialDiv (): HTMLDivElement {

  let sDiv = document.createElement('div')
  sDiv.id = 'sDiv'

  sDiv.classList.add('applyInvertFilter')
  sDiv.classList.add('applyFadeOut')
  

  const sParagraph = document.createElement('p');
  sParagraph.style.cssText = 'vertical-align: middle;'
  sParagraph.innerHTML = '<a href="https://paypal.me/rwachler"><img src="/paypal.svg" width="50" height="auto"/></a>&nbsp;&nbsp;&nbsp;<a href="https://mastodon.social/@kreise"><img src="/mastodon.svg" width="50" height="auto"/></a>'

  
  sDiv.append(sParagraph)
  sDiv.style.cssText = 'vertical-align: middle; font-size: 10pt; position: fixed; bottom: 0; right: 1em;'

  return sDiv

}



export function fadeoutDatenschutzAndInfoParagraphs (): void {

  const applyFadeOutElements = document.querySelectorAll('.applyFadeOut') as NodeListOf<HTMLElement>

  applyFadeOutElements.forEach((element: HTMLElement) => {

    element.style.transition = 'opacity 60s'
    element.style.opacity = '0'
    
    window.setTimeout(() => {
      document.querySelectorAll('.applyFadeOut').forEach(e => e.remove())
    }, 60000)

  })

}


export function getSBSDiv (): HTMLDivElement {

  let sbsDiv = document.createElement('div')
  sbsDiv.id = 'sbsDiv'

  sbsDiv.classList.add('applyInvertFilter')
  sbsDiv.classList.add('applyFadeOut')
  

  const sbsParagraph = document.createElement('p');
  sbsParagraph.style.cssText = 'vertical-align: middle;'
  sbsParagraph.innerHTML = '<a href="#"><img src="/sbs.svg" width="50" height="auto"/></a>'

  
  sbsDiv.append(sbsParagraph)
  sbsDiv.style.cssText = 'vertical-align: middle; font-size: 10pt; position: fixed; bottom: 0; right: 50%; transform: translate(50%);'

  return sbsDiv

}

