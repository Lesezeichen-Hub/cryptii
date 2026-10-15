import ViewerView from '../Viewer.js'
import View from '../../View.js'

const copyIconSvg = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 1h8a1 1 0 0 1 1 1v10h-2V3H5V1zM3 4h8a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm0 2v7h7V6H3z"/></svg>'

/**
 * Text viewer view
 */
export default class TextViewerView extends ViewerView {
  /**
   * Constructor
   */
  constructor () {
    super()
    this._text = ''
    this._disabled = false
    this._$textarea = null
    this._$copyButtonLabel = null
  }

  /**
   * Returns text.
   * @return {string}
   */
  getText () {
    return this._text
  }

  /**
   * Sets text.
   * @param {string} text
   * @return {ViewerView} Fluent interface
   */
  setText (text) {
    if (this._text !== text) {
      this._text = text

      if (this._$textarea !== null) {
        this._$textarea.value = text
        this.layoutTextarea()
      }
    }
    return this
  }

  /**
   * Returns wether input is disabled.
   * @return {boolean}
   */
  isDisabled () {
    return this._disabled
  }

  /**
   * Sets wether input is disabled.
   * @param {boolean} disabled
   * @return {TextViewerView} Fluent interface
   */
  setDisabled (disabled) {
    this._disabled = disabled
    if (this._$textarea !== null) {
      if (disabled) {
        this._$textarea.disabled = 'disabled'
      } else {
        this._$textarea.removeAttribute('disabled')
      }
    }
    return this
  }

  /**
   * Renders view.
   * @protected
   * @return {HTMLElement}
   */
  render () {
    const $root = super.render()
    $root.classList.add('viewer-text')
    return $root
  }

  /**
   * Renders content.
   * @protected
   * @return {BrickView} Fluent interface
   */
  renderContent () {
    this._$textarea = View.createElement('textarea', {
      className: 'viewer-text__textarea',
      ariaLabel: 'Content',
      spellcheck: false,
      value: this._text,
      onInput: this.textareaValueDidChange.bind(this),
      onFocus: evt => this.focus(),
      onBlur: evt => this.blur()
    })

    if (this.isDisabled()) {
      this._$textarea.disabled = 'disabled'
    }

    const $copyButton = View.createElement('button', {
      className: 'viewer-text__copy',
      type: 'button',
      ariaLabel: 'Copy to clipboard',
      title: 'Copy to clipboard',
      onClick: evt => this.copyTextToClipboard(evt)
    }, [
      View.createElement('span', {
        className: 'viewer-text__copy-icon'
      }),
      this._$copyButtonLabel = View.createElement('span', {
        className: 'viewer-text__copy-label'
      }, 'Copy')
    ])
    $copyButton.firstChild.innerHTML = copyIconSvg

    const $content = super.renderContent()
    $content.appendChild(this._$textarea)
    $content.appendChild($copyButton)
    return $content
  }

  /**
   * Copies the visible text to the clipboard.
   * @param {Event} evt
   */
  async copyTextToClipboard (evt) {
    evt.preventDefault()
    const $button = evt.currentTarget

    try {
      let copied = false
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(this._$textarea.value)
          copied = true
        } catch {}
      }
      if (!copied) copied = this.copyTextUsingFallback()
      if (!copied) throw new Error('Copy failed')
      this._$copyButtonLabel.innerText = 'Copied'
      $button.setAttribute('aria-label', 'Copied to clipboard')
      $button.setAttribute('title', 'Copied to clipboard')
    } catch (error) {
      this._$copyButtonLabel.innerText = 'Copy failed'
      $button.setAttribute('aria-label', 'Copy to clipboard failed')
      $button.setAttribute('title', 'Copy to clipboard failed')
    }

    window.setTimeout(() => {
      this._$copyButtonLabel.innerText = 'Copy'
      $button.setAttribute('aria-label', 'Copy to clipboard')
      $button.setAttribute('title', 'Copy to clipboard')
    }, 1500)
  }

  copyTextUsingFallback () {
    const $activeElement = document.activeElement
    const $temporaryTextarea = View.createElement('textarea', {
      value: this._$textarea.value
    })
    $temporaryTextarea.setAttribute('readonly', '')
    $temporaryTextarea.style.position = 'fixed'
    $temporaryTextarea.style.left = '-9999px'
    document.body.appendChild($temporaryTextarea)

    let copied = false
    try {
      $temporaryTextarea.select()
      copied = document.execCommand('copy')
    } finally {
      $temporaryTextarea.remove()
      if ($activeElement) $activeElement.focus()
    }
    return copied
  }

  /**
   * Triggered when textarea value changed.
   * @protected
   * @param {Event} evt
   */
  textareaValueDidChange (evt) {
    if (this.isDisabled()) {
      evt.preventDefault()
      return false
    }

    const text = this._$textarea.value

    if (this._text !== text) {
      this._text = text

      // notify model about text change
      this.getModel().viewTextDidChange(this, this._text)

      this.layoutTextarea()
    }
  }

  /**
   * Layouts view and its subviews.
   * @return {View}
   */
  layout () {
    this.layoutTextarea()
    return super.layout()
  }

  /**
   * Calculates height nessesary to view the text without scrollbars.
   * @protected
   * @return {TextViewerView} Fluent interface
   */
  layoutTextarea () {
    this._$textarea.style.height = ''
    this._$textarea.style.height = `${this._$textarea.scrollHeight}px`
    return this
  }

  /**
   * Updates view on model change.
   * @return {View} Fluent interface
   */
  update () {
    // Update status
    const error = this.getModel().getError()
    if (error !== null) {
      return this.updateStatus(
        'error',
        'Binary content can\'t be interpreted as text. ' +
        'Try switching to the bytes view. ' +
        error.message
      )
    } else {
      return this.updateStatus(null)
    }
  }
}
