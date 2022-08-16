export interface Deck {
  id: any // @TODO: @kamil
  name: string
  stats: {
    new: number
    review: number
  }
}

export interface SingleCard {
  id: string
  front: string
  back: string
}

export interface StudyItem {
  cardId: string
}
