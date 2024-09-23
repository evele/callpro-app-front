<template>
    <Dialog v-model:visible="visible" pt:root:class="modal">
        <template #container>
            <div class="modal-bg"></div>
            <section class="modal-container">
                <div class="modal-layout">
                    <header class="modal-header">
                        <h2 class="modal-header-title">Add new contact <ChevronDownSVG /></h2>
                        <Button class="modal-header-close" @click="close"><CloseSVG/></Button>
                    </header>

                    
                    <footer class="modal-footer">
                        <Button @click="add_new" class="modal-footer-btn btn-add-new">
                            Add new phone
                        </Button>
                        <Button @click="save_contact" class="modal-footer-btn btn-save">
                            Save
                        </Button>
                    </footer>
                </div>
            </section>
        </template>
    </Dialog>
</template>

<script setup lang="ts">
    const visible = ref(false);

    const open = () => {
        visible.value = true;
        const body = document.body;
        body.style.overflow = 'hidden';
    }

    const close = () => {
        visible.value = false;
        const body = document.body;
        body.style.overflow = 'auto';
    }

    defineExpose({ open });

    const add_new = () => {
        console.log('Adding new phone...');
    }

    const save_contact = () => {
        console.log('Saving contact...');
    }
</script>

<style scoped lang="scss">
    .modal-bg {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .modal-container {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        background-color: #FFF;
        padding-bottom: 38px;
        border-radius: 30px;
        width: 100%;
    }

    .modal-layout {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;
        gap: 38px;
        width: 100%;
    }

    .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 90px;
        padding: 0 20px;
        border-bottom: 1px solid #CAC4D0;
        @media (min-width: 400px) {
            padding: 0 34px;
        }

        .modal-header-title {
            color: #000;
            font-size: 18px;
            font-weight: 600;
            line-height: 140%;
            display: flex;
            align-items: center;
            gap: 8px;
            margin: auto 0;
            @media (min-width: 400px) {
                font-size: 23.8px;
            }
        }

        .modal-header-close {
            background-color: transparent;
            border: none;
            cursor: pointer;
            border-radius: 100%;
            padding: 6px;

            &:hover {
                background-color: #F5F5F5;
            }
        }
    }

    .modal-footer {
        width: 100%;
        text-align: center;
        padding: 0 26px;
        display: flex;
        justify-content: center;
        gap: 50px;

        .modal-footer-btn {
            border-radius: 30px;
            max-width: 300px;
            width: 100%;
            height: 40px;
            font-size: 16px;
            font-weight: 700;
            transition: background-color 0.3s;

            &:hover {
                cursor: pointer;
            }

            /*
            &:disabled {
                opacity: 0.6;
                background-color: rgba(101, 52, 148, 0.60);
                color: #B3B3B3;
                border: 1px solid #B3B3B3;
            }
            */
        }

        .btn-add-new {
            background-color: #F5F5F5;
            color: #000;
            border: 1px solid #000;
            &:hover {
                background-color: #E5E5E5;
            }
        }

        .btn-save {
            background-color: #653494;
            color: #FFF;
            border: 1px solid #FFF;
            &:hover {
                background-color: #4A1D6E;
            }
        }
    }
</style>