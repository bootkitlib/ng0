import { Injectable, RendererFactory2, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StyleManager {
  private readonly _rendererFactory = inject(RendererFactory2);
  private readonly _document: Document = inject(DOCUMENT);
  private readonly _renderer = this._rendererFactory.createRenderer(null, null);
  private readonly _loadedStyles = new Map<string, HTMLLinkElement>();

  /**
   * Loads a CSS
   * @param url 
   * @returns Promise<HTMLLinkElement>
   */
  public load(url: string): Promise<HTMLLinkElement> {
    return new Promise<HTMLLinkElement>((resolve, reject) => {

      if (this._loadedStyles.has(url)) {
        return resolve(this._loadedStyles.get(url)!);
      }

      const elm = this._renderer.createElement('link');
      elm.rel = 'stylesheet';
      elm.href = url;

      elm.onload = (res: any) => {
        this._loadedStyles.set(url, elm);
        return resolve(elm);
      }

      this._document.head.append(elm);
    });
  }

  /**
   * Unloads a CSS from the DOM
   * @param url 
   * @returns void
   */
  public unload(url: string): void {
    this._document.head.childNodes.forEach(x => {
      // if(x.nodeName)
    });
  }
}