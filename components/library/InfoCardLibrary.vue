<template>
    <Card class="flex justify-center items-center h-[12.5rem] w-[18.75rem] bg-[#fcfcfe] border border-[#CAC4D0] shadow-md pl-5">
        <template #content>
            <article class="flex gap-8">
                <div class="text-center">
                    <CloudSVG class="text-[#1E1E1E]" />
                    <p class="text-[#653494] font-bold text-3xl">2</p>
                    <p class="text-[#79747E] text-xl">Files</p>
                </div>
                <div class="flex items-end">
                    <div class="flex items-center gap-3">
                        <Avatar class="bg-[#fff1c2] rounded-[10px]">
                            <CallInSVG class="w-4 h-4 text-[#E5A000]" />
                        </Avatar>
                        <p class="text-[#79747E]"><span class="font-bold text-[#653494] mr-3">0</span>Call In</p>
                    </div>
                </div>
            </article>
        </template>
    </Card>
</template>