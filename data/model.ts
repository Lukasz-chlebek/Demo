export interface Deck {
  id: any // @TODO: @kamil
  name: string
  stats: {
    new: number
    review: number
  }
}

export interface SingleCard {
  id: any // @TODO: @kamil
  front: string
  back: string
}

export interface StudyItem {
  cardId: string
}
