<template>
    <div
      class="card-item"
      :class="{ '-active': isCardFlipped }"
      v-if="labels && inputFields"
    >
      <div class="card-item__side -front">
        <div
          :class="{ '-active': focusElementStyle !== null }"
          :style="focusElementStyle"
          class="card-item__focus"
          ref="focusElement"
        ></div>
        <div class="card-item__cover" :aria-label="imageCover">
          <img
            v-if="currentCardBackground"
            :src="currentCardBackground"
            class="card-item__bg"
            alt="Background image"
          />
        </div>
        <div class="card-item__wrapper">
          <div class="card-item__top">
            <img
              :src="chip"
              class="card-item__chip"
              alt="Card chip image"
            />
            <div class="card-item__type">
              <transition name="slide-fade-up">
                <component 
                  v-if="cardType" 
                  :is="getCardIcon(cardType)" 
                  :key="cardType" 
                  class="card-item__typeImg" 
                />
              </transition>
            </div>
          </div>
          <label
            :for="inputFields.cardNumber"
            :ref="inputFields.cardNumber"
            aria-label="Card number"
            class="card-item__number"
            :class="textStyle"
            id="cardNumber"
          >
            <div v-if="props.isEditing">{{ props.encryptedNumber }}</div>
            <span v-else v-for="(n, $index) in currentPlaceholder" :key="$index">
              <transition name="slide-fade-up">
                <div
                  v-if="getIsNumberMasked($index, n)"
                  class="card-item__numberItem"
                >
                  *
                </div>
                <div
                  v-else-if="valueFields.cardNumber.length > $index"
                  :class="{ '-active': n.trim() === '' }"
                  :key="currentPlaceholder"
                  class="card-item__numberItem"
                >
                  {{ valueFields.cardNumber[$index] }}
                </div>
                <div
                  v-else
                  :class="{ '-active': n.trim() === '' }"
                  :key="currentPlaceholder + 1"
                  class="card-item__numberItem"
                >
                  {{ n }}
                </div>
              </transition>
            </span>
          </label>
          <div class="card-item__content" :class="textStyle">
            <label
              :for="inputFields.cardName"
              :ref="inputFields.cardName"
              aria-label="Card name"
              class="card-item__info"
              :class="textStyle"
              id="cardName"
            >
              <transition name="slide-fade-up">
                <div
                  v-if="valueFields.cardName.length"
                  class="card-item__name"
                  key="1"
                >
                  <transition-group name="slide-fade-right">
                    <span
                      v-for="(n, key) in valueFields.cardName.replace(
                        /\s\s+/g,
                        ' '
                      )"
                      :key="key + 1"
                      class="card-item__nameItem"
                      >{{ n }}</span
                    >
                  </transition-group>
                </div>
                <div class="card-item__name" v-else key="2">
                  {{ labels.cardName || "Full Name" }}
                </div>
              </transition>
            </label>
            <div class="card-item__date" ref="cardDate" id="cardDate">
              <label
                :for="inputFields.cardMonth"
                class="card-item__dateItem"
                aria-label="Card month"
              >
                <transition name="slide-fade-up">
                  <span
                    v-if="valueFields.cardMonth"
                    :key="valueFields.cardMonth"
                    >{{ valueFields.cardMonth }}</span
                  >
                  <span v-else key="2">{{ labels.cardMonth || "MM" }}</span>
                </transition>
              </label>/
              <label
                :for="inputFields.cardYear"
                class="card-item__dateItem"
                aria-label="Card year"
              >
                <transition name="slide-fade-up">
                  <span v-if="valueFields.cardYear" :key="valueFields.cardYear">&nbsp;{{ valueFields.cardYear }}</span>
                  <span v-else key="2">&nbsp;{{ labels.cardYear || "YY" }}</span>
                </transition>
              </label>
            </div>
          </div>
        </div>
      </div>


      <div class="card-item__side -back">
        <div class="card-item__cover" :aria-label="imageCover">
          <img
            v-if="currentCardBackground"
            :src="currentCardBackground"
            class="card-item__bg"
            alt="Background image"
          />
        </div>
        <div class="card-item__band"></div>
        <div class="card-item__cvv">
          <label :for="inputFields.cardCvv" aria-label="Card CVV">
            <div class="card-item__cvvTitle" :class="textStyle">{{ labels.cardCvv }}</div>
            <div class="card-item__cvvBand">
              <span>{{ valueFields.cardCvv }}</span>
            </div>
          </label>
          <div class="card-item__type">
            <component 
              v-if="cardType" 
              :is="getCardIcon(cardType)" 
              :key="cardType" 
              class="card-item__typeImg" 
            />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
    import randomBg from '@/assets/png/random-card.png';
    import mastercardBg from '@/assets/png/mastercard-bg.png';
    import visaBg from '@/assets/png/visa-bg.png';
    import chip from '@/assets/png/chip.png';

    type ValueFields = {
        cardName: string,
        cardNumber: string,
        cardMonth: string,
        cardYear: string,
        cardCvv: string
    }

    type InputFields = {
        cardNumber: 'v-card-number',
        cardName: 'v-card-name',
        cardMonth: 'v-card-month',
        cardYear: 'v-card-year',
        cardCvv: 'v-card-cvv'
    }

    type Labels = {
        cardName: 'Full Name',
        cardHolder: 'Card Holder',
        cardMonth: 'MM',
        cardYear: 'YY',
        cardExpires: 'Expires',
        cardCvv: 'CVV'
    }

    type FocusStyle = {
        width: string,
        height: string,
        transform: string
    }

    const props = withDefaults(defineProps<{
        valueFields: ValueFields,
        inputFields?: InputFields,
        labels?: Labels,
        isCardNumberMasked?: boolean,
        setType?: CardType
        currentFocus?: string | null,
        isEditing?: boolean,
        encryptedNumber?: StringOrNull
    }>(), {
        inputFields: () => ({
            cardNumber: 'v-card-number',
            cardName: 'v-card-name',
            cardMonth: 'v-card-month',
            cardYear: 'v-card-year',
            cardCvv: 'v-card-cvv'
        }),
        labels: () => ({
            cardName: 'Full Name',
            cardHolder: 'Card Holder',
            cardMonth: 'MM',
            cardYear: 'YY',
            cardExpires: 'Expires',
            cardCvv: 'CVV'
        }),
        isCardNumberMasked: true,
        setType: CardType.UNKNOWN,
        currentFocus: null,
        isEditing: false,
        encryptedNumber: null
    })

    const emit = defineEmits<{
        'get-type': [value: CardType],
    }>()

    const { getCardIcon } = useCreditCards()

    const defaultPlaceholder = '#### #### #### ####';
    const focusElementStyle = ref<FocusStyle | null>(null);
    const currentFocus = ref(props.currentFocus);
    const forcedCurrentFocus = computed(() => props.currentFocus);
    const isFocused = ref(false);
    const isCardFlipped = ref(false);
    const wasCardFlipped = ref(false);
    const amexCardPlaceholder = '#### ###### #####';
    const dinersCardPlaceholder = '#### ###### ####';
    const defaultCardPlaceholder = defaultPlaceholder;
    const currentPlaceholder = ref(defaultPlaceholder);

    const cardType = computed<CardType>(() => {
      const acceptedTypes = Object.values(CardType).filter(type => type !== CardType.UNKNOWN);

      const setType = props.setType?.toLowerCase()?.replace(/ /g, '');
      const matchedType = acceptedTypes.find(type => type.toLowerCase() === setType);
      if (matchedType) return matchedType;

      const number = props.valueFields.cardNumber.replace(/\s+/g, '');
      const bin = number.slice(0, 6);

      const cardPatterns: Record<CardType, RegExp> = {
          [CardType.VISA]: /^4/,
          [CardType.MASTERCARD]: /^(?:5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/,
          [CardType.AMERICAN_EXPRESS]: /^3[47]/,
          [CardType.DISCOVER]: /^6011|^64[4-9]|^65/,
          [CardType.JCB]: /^35/,
          [CardType.DINERS_CLUB]: /^3(0[0-5]|[68])/,
          [CardType.MAESTRO]: /^(?:50(?:18|20|38)|5[6-9]|6\d)/,
          [CardType.UNIONPAY]: /^62/,
          [CardType.UNKNOWN]: /.*/, // Fallback to avoid undefined
      };


      for (const [type, pattern] of Object.entries(cardPatterns)) {
          if (pattern.test(bin)) return type as CardType;
      }

      return CardType.UNKNOWN;
    });

    const textStyle = computed(() => {
      if(cardType.value === CardType.MASTERCARD) return 'text-black'
      if(cardType.value === CardType.VISA) return 'text-black'
      if(cardType.value !== CardType.UNKNOWN) return 'text-white'

      return 'text-white'
    });

    const currentCardBackground = computed(() => {
        if(cardType.value === CardType.MASTERCARD) return mastercardBg;
        if(cardType.value === CardType.VISA) return visaBg;
        if(cardType.value !== CardType.UNKNOWN) return randomBg;

        return null;
    });

    const imageCover = computed(() => currentCardBackground.value ? 'Image cover' : '');

    watch(currentFocus, () => {
        if (currentFocus.value) {
            changeFocus();
        } else {
            focusElementStyle.value = null;
        }
    });

    watch(forcedCurrentFocus, () => {
        if(forcedCurrentFocus.value) {
          changeFocusDebounced('cardDate');
          isFocused.value = true;
        } else {
          if(currentFocus.value === 'cardDate') {
            currentFocus.value = null;
            isFocused.value = false;
          }
        }
    });

    watch(cardType, (val: CardType) => {
        emit('get-type', val);
        changePlaceholder();
    });

    const changeFocusDebounced = (focus: string) => {
      if(wasCardFlipped.value) {
        setTimeout(() => {
            currentFocus.value = focus;
        }, 700);
        wasCardFlipped.value = false;
      } else {
        currentFocus.value = focus;
      }
    }

    watch(() => isCardFlipped.value, (newVal: boolean) => {
        if(newVal) {
            wasCardFlipped.value = true;
        }
    });

    function addOrRemoveFieldListeners(event: 'addEventListener' | 'removeEventListener' = 'addEventListener') {
        const fields = document.querySelectorAll('[data-card-field]');
        fields.forEach((element) => {
            element[event]('focus', () => {
              isFocused.value = true;
              if(element.id === props.inputFields.cardName) {
                changeFocusDebounced('cardName');
              } else if(element.id === props.inputFields.cardNumber) {
                changeFocusDebounced('cardNumber');
              } else {
                currentFocus.value = null;
              }
              isCardFlipped.value = element.id === props.inputFields.cardCvv;
            });

            element[event]('blur', () => {
              isCardFlipped.value = false
              const timeout = setTimeout(() => {
                  if (!isFocused.value) {
                  currentFocus.value = null;
                  }
                  clearTimeout(timeout);
              }, 300);
              isFocused.value = false;
            });
        });
    }

    const init = () => addOrRemoveFieldListeners()
    const destroy = () => addOrRemoveFieldListeners('removeEventListener')

    onMounted(() => init());
    onBeforeUnmount(() => destroy());

    function changeFocus() {
        if(!currentFocus.value) return;
        const target = document.getElementById(currentFocus.value);
        const card = document.querySelector('.card-item');

        if (!target || !card) return;

        const cardRect = card.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();

        const left = targetRect.left - cardRect.left + card.scrollLeft;
        const top = targetRect.top - cardRect.top + card.scrollTop;

        focusElementStyle.value = {
            width: `${targetRect.width}px`,
            height: `${targetRect.height}px`,
            transform: `translate(${left}px, ${top}px)`,
        };
    }


    function getIsNumberMasked(index: number, n: string) {
        const numbers = cardType.value === CardType.AMERICAN_EXPRESS ? 13 : 14;
        return (
            index < numbers &&
            props.valueFields.cardNumber.length > index &&
            n.trim() !== '' &&
            props.isCardNumberMasked
        );
    }

    function changePlaceholder() {
        const cardPlaceholders: Record<CardType, string> = {
          [CardType.VISA]: defaultPlaceholder,
          [CardType.MASTERCARD]: defaultPlaceholder,
          [CardType.AMERICAN_EXPRESS]: amexCardPlaceholder,
          [CardType.DISCOVER]: defaultPlaceholder,
          [CardType.JCB]: defaultPlaceholder,
          [CardType.DINERS_CLUB]: dinersCardPlaceholder,
          [CardType.MAESTRO]: defaultPlaceholder,
          [CardType.UNIONPAY]: defaultPlaceholder,
          [CardType.UNKNOWN]: defaultPlaceholder,
        };

        currentPlaceholder.value = cardPlaceholders[cardType.value as CardType] || defaultCardPlaceholder;
        nextTick(() => {
            changeFocus();
        });
    }
</script>
  
<style src="@/assets/css/paycard.css" scoped></style>