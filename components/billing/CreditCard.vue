<template>
    <CardOptionContainer type="credit">
        <template #chip-icon>
            <div class="w-fit h-[30px] rounded-lg bg-white border flex items-center gap-2 px-1 border-grey-main">
                <CoinSVG />
                <span class="text-dark-3 font-semibold leading-0 mt-[1px]">50000</span>
            </div>
        </template>
        
        <template #card-content>
            <div class="flex flex-col gap-1">
                <div class="flex justify-between items-center flex-wrap">
                    <p class="text-3xl font-semibold">$1500</p>
                    <p class="text-gray-200 text-xs font-normal">$4.5 x credit</p>
                </div>

                <Divider class="bg-[#E8DEF8] h-[2px] rounded-full" />

                <p class="text-xs text-light-purple-3 h-4">60% discount</p>
            </div>
        </template>
        
    </CardOptionContainer>
</template>