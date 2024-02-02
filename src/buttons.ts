/*
export function buttonSwitchSBS(
  element: HTMLButtonElement,
  sbsEnabled: boolean
): void {
  const switchSBS = (): void => {
    sbsEnabled = !sbsEnabled
    if (sbsEnabled) {
      element.innerHTML = '3D SBS on'
    } else {
      element.innerHTML = '3D SBS off'
    }
  }
  element.addEventListener('click', switchSBS())
}
*/

export function controlPanelDiv (): HTMLDivElement {
  const controlPanelDiv: HTMLDivElement = document.createElement('div')
  controlPanelDiv.id = 'controlPanelDiv'
  controlPanelDiv.setAttribute(
    'style',
    'position: fixed; bottom: 1em; left: 50%; transform: translate(-50%, 0); opacity: 0; transition: all 10s'
  )

  const openCloseControlPanelButton: HTMLButtonElement = document.createElement('button')
  openCloseControlPanelButton.id = 'openCloseControlPanelButton'
  openCloseControlPanelButton.setAttribute(
    'style',
    'height: 5em; width: 5em; border-radius: 50%;'
  )

  controlPanelDiv.appendChild(openCloseControlPanelButton)

  return controlPanelDiv
}

export function debugDiv (): HTMLDivElement {
  const debugDiv: HTMLDivElement = document.createElement('div')
  debugDiv.id = 'debugDiv'
  debugDiv.setAttribute('style', 'position: fixed; top: 1em; left: 70%;')

  /*
  let openCloseControlPanelButton : HTMLButtonElement = document.createElement('button')
  openCloseControlPanelButton.id = "openCloseControlPanelButton";
  openCloseControlPanelButton.setAttribute('style', 'height: 5em; width: 5em; border-radius: 50%;');

  openCloseControlPanelButton.onclick(event )

  controlPanelDiv.appendChild(openCloseControlPanelButton);
  */

  return debugDiv
}
