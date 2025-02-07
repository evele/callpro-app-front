<template>
    <div class="w-[250px] w-full rounded-2xl p-3 h-56 bg-white">
        <div class="border py-3 rounded-xl h-full flex flex-col justify-end gap-9 bg-gray-6 pb-4">
            <slot name="content" />
            <div class="flex"><slot name="footer" /></div>
        </div>
    </div>
</template>