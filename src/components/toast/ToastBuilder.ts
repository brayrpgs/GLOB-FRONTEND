import { Color, Mode } from '@ionic/core'
import { IonicSafeString, ToastOptions } from '@ionic/react'

class ToastBuilder {
  private readonly toast: ToastOptions = {}

  setMessage (message: string | IonicSafeString): this {
    this.toast.message = message
    return this
  }

  setMode (mode: Mode): this {
    this.toast.mode = mode
    return this
  }

  setAnimated (animated: boolean): this {
    this.toast.animated = animated
    return this
  }

  setColor (color: Color): this {
    this.toast.color = color
    return this
  }

  setDuration (duration: number): this {
    this.toast.duration = duration
    return this
  }

  setTranslucent (translucent: boolean): this {
    this.toast.translucent = translucent
    return this
  }

  setPosition (position: 'top' | 'bottom' | 'middle'): this {
    this.toast.position = position
    return this
  }

  build (): ToastOptions {
    // Opcional: validaciones antes de devolver
    if (this.toast.message === undefined) throw new Error('the message in toast is requered!')
    return { ...this.toast }
  }
}

export { ToastBuilder }
