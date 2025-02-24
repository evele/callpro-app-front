import MastercardSVG from '@/components/svgs/MastercardSVG.vue'
import VisaSVG from '@/components/svgs/VisaSVG.vue'

export const useCreditCards = () => {

    const getCardIcon = (cardType: CardType) => {
        switch (cardType) {
            case CardType.MASTERCARD:
                return MastercardSVG
            case CardType.VISA:
                return VisaSVG
            default:
                return 'div'
        }

        //TODO: Get the rest of the card icons

        // switch (card_type) {
        //     case CardType.MASTERCARD:
        //         return 'MastercardSVG'
        //     case CardType.VISA:
        //         return 'VisaSVG'
        //     case CardType.AMERICAN_EXPRESS:
        //         return 'AmericanExpressSVG'
        //     case CardType.DISCOVER:
        //         return 'DiscoverSVG'
        //     case CardType.JCB:
        //         return 'JCBSVG'
        //     case CardType.DINERS_CLUB:
        //         return 'DinersClubSVG'
        //     default:
        //         return 'div'
        // }
    }

    return { getCardIcon }
}