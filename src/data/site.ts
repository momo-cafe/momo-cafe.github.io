export const business = {
  name: "Café Momo",
  street: "Oude Kijk in 't Jatstraat 69",
  postcode: '9712 EE',
  city: 'Groningen',
  kvk: '93737297',
  instagram: 'https://www.instagram.com/cafe_momo_/',
  mapsUrl: 'https://maps.app.goo.gl/',
}

export const hours = {
  mon: '08:30 - 17:00',
  tue: '08:30 - 17:00',
  wed: '08:30 - 17:00',
  thu: '08:30 - 17:00',
  fri: '08:30 - 17:00',
  sat: '09:00 - 17:00',
  sun: '09:00 - 17:00',
}

export const hero = {
  headline: 'koffie, matcha en iets lekkers',
  sub: "aan de Oude Kijk in 't Jatstraat. loop binnen.",
}

export const about = {
  heading: 'over momo',
  body: 'Twee of drie zinnen van de eigenaar zelf: waarom deze straat, wat er in de kast staat, wie er achter de bar staat.',
}

export const practical = [
  'pinnen en contant',
  'bank buiten in de zon',
  'havermelk zonder extra kosten',
  'geen reserveringen, gewoon binnenlopen',
]

export const gallery = [
  { src: '/img/bar.jpg', alt: 'De glasblokken bar met het espressoapparaat', caption: 'de bar' },
  { src: '/img/cake.jpg', alt: 'Drie bordjes cake met slagroom', caption: 'cake, drie keer' },
  { src: '/img/raam.jpg', alt: 'Gasten in de zon voor het raam', caption: 'middagzon' },
]

export type MenuItem = { name: string; price: string; note?: string }
export type MenuSection = {
  id: string
  heading: string
  footnote?: string
  items?: MenuItem[]
  groupPrice?: string
  options?: string[]
}

export const menu: { orderNotice: string; allergenNotice: string; sections: MenuSection[] } = {
  orderNotice: 'bestellen aan de bar',
  allergenNotice: 'Vraag ons naar allergenen. We hebben de volledige informatie achter de bar.',
  sections: [
    {
      id: 'koffie',
      heading: 'koffie',
      footnote: 'haver- of kokosmelk, decaf en iced mogelijk / extra shot +0,50',
      items: [
        { name: 'espresso', price: '2,9 / 3,9' },
        { name: 'americano', price: '3,5' },
        { name: 'filter v60', price: '5,5' },
        { name: 'cortado', price: '3,8' },
        { name: 'flat white', price: '4,4' },
        { name: 'cappuccino', price: '3,9 / 4,5' },
        { name: 'latte', price: '4,5' },
        { name: 'espresso tonic', price: '5,5' },
        { name: 'dirty chai', price: '4,9' },
        { name: 'affogato', price: '4,5' },
        { name: 'iced spanish latte', price: '4,9' },
      ],
    },
    {
      id: 'niet-koffie',
      heading: 'niet koffie',
      items: [
        { name: 'iced matcha latte', note: 'mango/aardbei +1', price: '4,9' },
        { name: 'iced matcha coconut cloud', price: '5,7' },
        { name: 'matcha affogato', price: '5,7' },
        { name: 'hojicha latte', price: '5,3' },
        { name: 'iced earl grey vanilla hojicha latte', price: '5,7' },
        { name: 'chai latte', price: '4,5' },
        { name: 'gember of munt thee', price: '3,5' },
        { name: 'kombucha', price: '5,5' },
        { name: 'homemade lemonade citroen, gember of passievrucht', price: '4,9' },
        { name: 'kokoswater', price: '4,2' },
      ],
    },
    {
      id: 'food',
      heading: 'food',
      items: [
        { name: 'granola bowl', note: 'kokosyoghurt of Griekse yoghurt, huisgemaakte granola, seizoensfruit', price: '9' },
        { name: 'coconut chia pudding', note: 'mango, geroosterde cashewnoten, maple syrup', price: '9,5' },
        { name: 'toasted banana bread', note: 'mascarpone, keuze uit lemon curd of blueberry compote', price: '8' },
        { name: 'scandinavian breakfast', note: 'zuurdesembrood, whipped butter, jam, kaas, gekookt ei', price: '10,5' },
        { name: 'grilled cheese sandwich', note: 'zuurdesembrood, sriracha mayo apart. maak er een tuna melt van +2', price: '9' },
        { name: 'kimchi grilled cheese sandwich', note: 'zuurdesembrood, kimchi, sriracha mayo apart', price: '9,5' },
        { name: 'mozzarella di bufala sandwich', note: 'pesto, mozzarella, tomaten', price: '12' },
      ],
    },
    {
      id: 'sweets',
      heading: 'sweets',
      groupPrice: '4,9',
      options: [
        'banana bread',
        'lemon cake',
        'pistache white chocolate of triple chocolate chip cookie',
        'cardamom bun',
      ],
    },
  ],
}

export const footer = {
  credit: 'gemaakt in Groningen',
}

export const meta = {
  title: 'Café Momo, Groningen. Koffie, matcha, ontbijt en lunch.',
  description: "Specialty coffee, matcha en huisgemaakte cake aan de Oude Kijk in 't Jatstraat 69 in Groningen. Dagelijks open.",
}
