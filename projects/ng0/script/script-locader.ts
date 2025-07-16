import { Renderer2, Inject, Injectable, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ScriptDefinition, ScriptDefinitionObject } from './types';

@Injectable({
  providedIn: 'root'
})
export class ScriptLoader {
  private _renderer: Renderer2;
  private _loadedScripts = new Map<string, any>();

  constructor(
    _rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private _document: Document,
  ) {
    this._renderer = _rendererFactory.createRenderer(null, null);
  }

  public async loadAll(...scripts: ScriptDefinition[]) {
    let r: { script: ScriptDefinition, element: any }[] = [];
    for (let s of scripts) {
      r.push({ script: s, element: await this.load(s) })
    }

    return r;
  }

  public load(script: ScriptDefinition): Promise<any> {
    return new Promise<string>((resolve, reject) => {

      let d: ScriptDefinitionObject = typeof script == 'string' ? { src: script } : script;

      if (this._loadedScripts.has(d.src)) {
        return resolve(this._loadedScripts.get(d.src));
      }

      const elm = this._renderer.createElement('script');
      elm.type = 'text/javascript';
      elm.src = d.src;

      // if (Array.isArray(d.attrs)) {
      //   d.attrs.forEach(attr => {
      //     this._renderer.setAttribute(elm, attr, d.attrs[attr]);
      //   });
      // }

      elm.onload = (res: any) => {
        this._loadedScripts.set(d.src, elm);
        return resolve(elm);
      }

      this._renderer.appendChild(this._document.body, elm);
    });
  }
}