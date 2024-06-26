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
  pDiv.style.cssText = 'vertical-align: middle; font-size: 10pt; position: fixed; bottom: 0; left: 20%; transform: translate(-50%);'

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
  vDiv.style.cssText = 'vertical-align: middle; font-size: 10pt; position: fixed; bottom: 0; left: 40%; transform: translate(-50%);'

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
  servicesDiv.style.cssText = 'vertical-align: middle; font-size: 10pt; position: fixed; bottom: 0; left: 60%; transform: translate(-50%);'

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
  sDiv.style.cssText = 'vertical-align: middle; font-size: 10pt; position: fixed; bottom: 0; left: 80%;  transform: translate(-50%);'

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
    Alle Leistungen erfolgen als Freiberufler<br>
    und beinhalten Weiterbildung
    <h4>Vollintegrierte Systemarchitektur</h4>
    · Programmierung in geeigneter Sprache ·<br>
    · Errichtung ergonomischer Arbeitspl&auml;tze ·<br>
    · Absicherung Ihrer IT auf Netzwerkebene ·<br>
    · Automatische Backups offsite / cloudfrei ·<br>
    · OpenSource Heimautomatisierung ·<br>
    <br>
    <a href="mailto:angebot@krei.se?subject=Angebotsanfrage&body=Bitte%20bedenken%20und%20nutzen%20Sie%20f%C3%BCr%20ein%20klares%20Angebot%20das%20S.I.E.-Prinzip%3A%0D%0A%0D%0ASoll-Zustand%3A%0D%0A%0D%0A-%20Welche%20Infrastruktur%20und%20Dienste%20sollen%20aufgebaut%20werden%3F%0D%0A-%20Welche%20Verbesserungen%20erhoffen%20Sie%20sich%3F%0D%0A-%20Wo%20haben%20Sie%20bereits%20mehrfach%20erfolglos%20Optimierungen%20angestrebt%3F%0D%0A%0D%0A...%0D%0A%0D%0AIst-Zustand%3A%0D%0A%0D%0A-%20Welche%20Hardware%20ist%20vorhanden%3F%0D%0A-%20Dienste%20und%20laufende%20Vertr%C3%A4ge%3F%0D%0A-%20Personal%3F%0D%0A-%20R%C3%A4umlichkeiten%3F%0D%0A%0D%0A...%0D%0A%0D%0AEnergiehaushalt%3A%0D%0A%0D%0A-%20Wieviel%20Zeit%20und%20Geld%20m%C3%B6chten%20Sie%20daf%C3%BCr%20ausgeben%3F%0D%0A-%20Welche%20Wartungsintervalle%20k%C3%B6nnen%20Sie%20tolerieren%3F%0D%0A%0D%0A...%0D%0A%0D%0ASie%20erhalten%20ein%20unverbindliches%20Angebot%20binnen%2024%20Stunden.">Angebot anfordern</a>
    `
  
  servicesOverlayDiv.append(servicesOverlayParagraphHeader)
  servicesOverlayDiv.style.cssText = 'vertical-align: middle; transition: opacity 3s; visibility: hidden; font-size: 11pt; font-weight: 300; position: fixed; top: 50%; right: 50%; width: 50em; height: 26em; transform: translate(50%,-50%); background-color: rgba(192,192,192,0.8)'

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

