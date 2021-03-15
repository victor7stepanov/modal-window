let fruits = [
    {id: 1, title: 'Яблоки', price: 20, img: 'https://graalopt.ru/wp-content/uploads/2020/07/yabloko-krasnoe.jpg'},
    {id: 2, title: 'Апельсины', price: 30, img: 'https://memegenerator.net/img/images/72625749.jpg'},
    {id: 3, title: 'Манго', price: 40, img: 'https://badbio.spb.ru/images/easyblog_articles/83/yellowmango_1200x1200.jpg'}
]

const toHTML = fruit => `
    <div class="col">
           <div class="card">
               <img src="${fruit.img}" class="card-img-top" style="height: 300px" alt="${fruit.title}">
               <div class="card-body">
                   <h5 class="card-title">${fruit.title}</h5>
                   <a href="#" class="btn btn-primary" data-btn="price" data-id="${fruit.id}">Посмотреть цену</a>
                   <a href="#" class="btn btn-danger" data-btn="remove" data-id="${fruit.id}">Удалить</a>
               </div>
           </div>
    </div>
`

// 1 динамически на основе массива вывести список карточек +
// 2 показать цену в модалке и это должна быть одна модалка +
// 3 модалка для удаления с двумя кнопками +
// 4 при нажатии да удалять карточку из дом дерева (на основе плагина $.modal сделать другой плагин
// $.confirm он будет работать про промисах) +


function render() {
    // const html = fruits.map(fruit => toHTML(fruit))
    const html = fruits.map(toHTML).join('')
    document.querySelector('#fruits').innerHTML = html
}

render()

const priceModal = $.modal({
    title: 'Цена на товар',
    closable: true,
    width: '400px',
    footerButtons: [
        {text: 'Закрыть', type: 'primary', handler() {
                priceModal.close()
            }}
    ]
})

// const confirmModal = $.modal({
//     title: 'Вы уверены?',
//     closable: true,
//     width: '400px',
//     footerButtons: [
//         {text: 'Отменить', type: 'secondary', handler() {
//                 confirmModal.close()
//             }},
//         {text: 'Удалить', type: 'danger', handler() {
//                 confirmModal.close()
//             }}
//     ]
// })

document.addEventListener('click', event => {
    event.preventDefault()
    const btnType = event.target.dataset.btn
    const id = +event.target.dataset.id
    // в js когда из строки забираем какую-либо величину, то она является строкой
    // и её нужно преобразовать в число для сравнения с числом
    const fruit = fruits.find(f => f.id === id)

    if (btnType === 'price') {
        priceModal.setContent(`
          <p>Цена на ${fruit.title}: <strong>${fruit.price}$</strong></p>  
        `)
        priceModal.open()
    } else if (btnType === 'remove') {
        $.confirm({
            title: 'Вы уверены?',
            content: `<p>Вы удаляете фрукт: <strong>${fruit.title}</strong></p>`
        }).then(() => {
            fruits = fruits.filter(f => f.id !== id)
            render()
        }).catch(() => {
            console.log('Cancel')
        })

        // confirmModal.setContent(`
        //     <p>Вы удаляете фрукт: <strong>${fruit.title}</strong></p>
        // `)
        // confirmModal.open()
    }
})