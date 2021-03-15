Element.prototype.appendAfter = function (element) {
    element.parentNode.insertBefore(this, element.nextSibling)
}

function noop() {}

function _createModalFooter(buttons = []) {
    if (buttons.length === 0) {
        return document.createElement('div')
    }

    const wrap = document.createElement('div')
    wrap.classList.add('modal-footer')

    buttons.forEach(btn => {
       const $btn = document.createElement('button')
       $btn.textContent = btn.text
       $btn.classList.add('btn')
       $btn.classList.add(`btn-${btn.type || 'secondary'}`)
       $btn.onclick = btn.handler || noop

       wrap.appendChild($btn)
    })

    return wrap
}


// нижнее подчеркивание системный метод, который не должен быть вызван отдельно, как бы "приватный"
function _createModal(options) {
    const DEFAULT_WIDTH = '600px'
    const modal = document.createElement('div')
    modal.classList.add('vmodal')
    modal.insertAdjacentHTML('afterbegin', `
        <div class="modal-overlay" data-close="true">
            <div class="modal-window" style="width: ${options.width || DEFAULT_WIDTH}">
                <div class="modal-header">
                    <span class="modal-title">${options.title}</span>
                    ${options.closable ? `<span class="modal-close" data-close="true">&times;</span>` : ''}
                </div>
                <div class="modal-body" data-content>
                    ${options.content || ''}
                </div>
            </div>
        </div>
    `)
    const footer = _createModalFooter(options.footerButtons)
    footer.appendAfter(modal.querySelector('[data-content]'))
    document.body.appendChild(modal)
    return modal
}

//реализовать объект options
// title: string передавать в модальное окно и чтобы он применялся +
// closable: boolean если тру то показывать крестик, если фолс то нет +
// content: string в формате html динамический контент для modal-body +
// width: string('400px') ширина модального окна +
// публичный метод destroy(): возвращает void +
// убирать из дом дерева модальное окно, удалять все слушатели, чтобы не оставалось никаких доп элементов
// при нажатии на крестик закрываться, при нажатии на оверлей закрываться с анимацией +
// кнопки ок и отмена

// * публичный метод (доступен для инстанса) setContent(html: string) :void | PUBLIC +
// динамически меняется содержимое модального окна +
// life cycle hooks, доступны как параметры
// onClose(): void хук который вызывается когда окно закрыто +
// onOpen(): void
// beforeClose(): boolean если true то тогда мод окно можно закрыть, если false то не закрывается
// animate.css библиотека, поиграться с анимациями

$.modal = function (options) {
    const ANIMATION_SPEED = 200
    const $modal = _createModal(options)
    // $ означает, что это Node-элемент
    let closing = false
    // защита от случайного вызова метода open
    let destroyed = false

    const modal = {
        open() {
            if (destroyed) {
                return console.log('Modal is destroyed')
            }
            !closing && $modal.classList.add('open')

        },
        close() {
            closing = true
            $modal.classList.remove('open')
            $modal.classList.add('hiding')
            setTimeout(() => {
                $modal.classList.remove('hiding')
                closing = false

                if (typeof options.onClose === 'function') {
                    options.onClose()
                    console.log('OnClose')
                }

            }, ANIMATION_SPEED)
        }
    }

    const listener = event => {
        if (event.target.dataset.close) {
            modal.close()
        }
    }

    $modal.addEventListener('click', listener)

    return Object.assign(modal, {
        destroy() {
            $modal.parentNode.removeChild($modal)
            $modal.removeEventListener('click', listener)
            destroyed = true
        },
        setContent(html) {
            $modal.querySelector('[data-content]').innerHTML = html
        }
    })
}
// обязательный метод destroy для модального окна, предотвращающий утечки памяти и создание множества окон