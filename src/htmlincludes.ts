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
  introDiv.onmouseover = () => {

    const applyFadeOutElements = document.querySelectorAll('.applyFadeOut') as NodeListOf<HTMLElement>

    applyFadeOutElements.forEach((element: HTMLElement) => {
  
      if (parseFloat(element.style.opacity) < 1) {

      element.style.opacity = '1'
      element.style.transition = 'opacity 2s'
      
      /*
      window.setTimeout(() => {
        document.querySelectorAll('.applyFadeOut').forEach(e => e.remove())
      }, 300000)
      */
  
      }

      else {

        element.style.transition = 'opacity 600s'
        element.style.opacity = '0'

      }

    })

  }

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
  datenschutzLink.innerHTML = 'Kontakt · Impressum · Datenschutz'

  datenschutzParagraph.append(datenschutzLink)

  introDiv.append(datenschutzParagraph)
  introDiv.append(infoParagraph)

  return pageOverlayDiv
}


export function getPayPalDiv (): HTMLDivElement {

  let pDiv = document.createElement('div')
  pDiv.id = 'pDiv'

  pDiv.classList.add('applyInvertFilter')
  pDiv.classList.add('applyFadeOut')
  

  const pParagraph = document.createElement('p');
  pParagraph.style.cssText = 'vertical-align: middle;'
  pParagraph.innerHTML = '<a href="https://paypal.me/rwachler"><img src="/paypal.svg" width="50" height="auto"/><br>F&ouml;rdern</a>'

  
  pDiv.append(pParagraph)
  pDiv.style.cssText = 'vertical-align: middle; font-size: 10pt; position: fixed; bottom: 0; left: 2em;'

  return pDiv

}


export function getVersionDiv (): HTMLDivElement {

  let vDiv = document.createElement('div')
  vDiv.id = 'vDiv'

  vDiv.classList.add('applyInvertFilter')
  vDiv.classList.add('applyFadeOut')
  

  const vParagraph = document.createElement('p');
  vParagraph.style.cssText = 'vertical-align: middle;'
  vParagraph.innerHTML = '<a href="https://github.com/krei-se/three.krei.se"><img src="/github-mark.svg" width="50" height="auto"/><br>' + import.meta.env.PACKAGE_VERSION + '</a>'
  
  vDiv.append(vParagraph)
  vDiv.style.cssText = 'vertical-align: middle; font-size: 10pt; position: fixed; bottom: 0; left: 33%; transform: translate(50%);'

  return vDiv

}

export function getServicesDiv(): HTMLDivElement {

  let servicesDiv = document.createElement('div')
  servicesDiv.id = 'servicesDiv'

  servicesDiv.classList.add('applyInvertFilter')
  servicesDiv.classList.add('applyFadeOut')
  

  const servicesParagraph = document.createElement('p');
  servicesParagraph.style.cssText = 'vertical-align: middle;'
  servicesParagraph.innerHTML = '<a href="#"><img src="/services.svg" width="50" height="auto"/><br>Leistungen</a>'
  
  servicesDiv.append(servicesParagraph)
  servicesDiv.style.cssText = 'vertical-align: middle; font-size: 10pt; position: fixed; bottom: 0; right: 33%; transform: translate(50%);'

  servicesDiv.onclick = () => {
    let servicesOverlayDiv = document.querySelector('#servicesOverlayDiv') as HTMLDivElement ?? document.createElement('div')
    
    if (servicesOverlayDiv.style.visibility === 'hidden') {
      servicesOverlayDiv.style.visibility = 'visible'
      servicesOverlayDiv.style.transition = 'opacity 3s'
      servicesOverlayDiv.style.opacity = '1'
      

    }
    else {
      servicesOverlayDiv.style.opacity = '0'
      // servicesOverlayDiv.style.transition = 'opacity 3s'
      window.setTimeout(() => { servicesOverlayDiv.style.visibility = 'hidden' }, 3000)

    }
    console.log(servicesOverlayDiv)
  }

  return servicesDiv

}

export function getSocialDiv (): HTMLDivElement {

  let sDiv = document.createElement('div')
  sDiv.id = 'sDiv'

  sDiv.classList.add('applyInvertFilter')
  sDiv.classList.add('applyFadeOut')
  

  const sParagraph = document.createElement('p');
  sParagraph.style.cssText = 'vertical-align: middle;'
  sParagraph.innerHTML = '<a href="https://mastodon.social/@kreise"><img src="/mastodon.svg" width="50" height="auto"/><br>Blog</a>'

  
  sDiv.append(sParagraph)
  sDiv.style.cssText = 'vertical-align: middle; font-size: 10pt; position: fixed; bottom: 0; right: 2em;'

  sDiv.onclick = () => {

  }

  return sDiv

}

export function getServicesOverlayDiv (): HTMLDivElement {

  let servicesOverlayDiv = document.createElement('div')
  servicesOverlayDiv.id = 'servicesOverlayDiv'

  servicesOverlayDiv.classList.add('applyInvertFilter')
  


  const servicesOverlayParagraphHeader = document.createElement('p');
  // servicesOverlayParagraphHeader.style.cssText = 'vertical-align: middle;'
  servicesOverlayParagraphHeader.innerHTML = `
    <h3>Leistungen</h3>
    Alle Leistungen erfolgen als Freiberufler
    <h4>Informationstechnologie</h4>
    · Bau vollintegrierter Systeme<br>
    · Einrichtung ergonomischer Arbeitspl&auml;tze<br>
    · Absicherung Ihrer IT auf Netzwerkebene<br>
    · Automatische Backups<br>
    · OpenSource Heimautomatisierung<br>
    <br>
    Alle Leistungen beinhalten Weiterbildung<br>
    <br>
    <a href="mailto:auftrag@krei.se">Mail</a>
    `
  
  servicesOverlayDiv.append(servicesOverlayParagraphHeader)
  servicesOverlayDiv.style.cssText = 'vertical-align: middle; transition: opacity 3s; visibility: hidden; font-size: 11pt; font-weight: 300; position: fixed; top: 50%; right: 50%; width: 50em; height: 30em; transform: translate(50%,-50%); background-color: rgba(192,192,192,0.8)'

  return servicesOverlayDiv

}




export function fadeoutDatenschutzAndInfoParagraphs (): void {

  const applyFadeOutElements = document.querySelectorAll('.applyFadeOut') as NodeListOf<HTMLElement>

  applyFadeOutElements.forEach((element: HTMLElement) => {


    element.style.transition = 'opacity 5s'
    element.style.opacity = '1'
    
    /*
    window.setTimeout(() => {
      document.querySelectorAll('.applyFadeOut').forEach(e => e.remove())
    }, 300000)
    */

  })

  applyFadeOutElements.forEach((element: HTMLElement) => {


    element.style.transition = 'opacity 600s'
    element.style.opacity = '0'
    
    /*
    window.setTimeout(() => {
      document.querySelectorAll('.applyFadeOut').forEach(e => e.remove())
    }, 300000)
    */

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

