<template>
    <section class="bg-white p-4 shadow-lg rounded-2xl w-[250px] min-h-[500px] flex flex-col justify-between">
        <div>
            <h4 class="font-semibold text-xl">Recap</h4>

            <ul class="font-semibold text-dark-3 mt-10">
                <li class="flex items-center justify-between">Credit Pack <span class="text-grey-5">{{ format_price(6250) }}</span></li>
                <li class="mt-3 flex items-center justify-between">Discount <span class="text-grey-5">{{ format_price(4750) }}</span></li>
                <li class="mt-3 flex items-center justify-between">Subtotal <span class="text-grey-5">{{ format_price(1500) }}</span></li>
            </ul>

            <Divider class="bg-grey-6 h-[2px] rounded-full" />

            <div class="flex justify-between text-dark-3 font-semibold text-lg">
                <p>Total</p>
                <p>{{ format_price(6250 + 4750 + 1500) }}</p>
            </div>
        </div>

        <footer class="flex">
            <Button class="mt-6 w-full rounded-xl max-w-[170px] h-[42px] mx-auto" color="primary">Next</Button>
        </footer>
        
    </section>
</template>