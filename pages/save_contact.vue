<template>
    <div style="padding: 0 1rem;">
        <p class="text-title">Save contact page</p>

        <form @submit.prevent>
            <div class="div-style">
                <label for="fname">First name</label>
                <input type="text" id="fname" v-model="new_contact.first_name" placeholder="Enter first name...">
            </div>

            <div class="div-style">
                <label for="lname">Last name</label>
                <input type="text" id="lname" v-model="new_contact.last_name" placeholder="Enter last name...">
            </div>

            <div class="div-style">
                <label for="phone">Phone (Ext)</label>
                <input type="text" id="phone" v-model="new_contact.numbers[0].number" placeholder="(xxx) xxx - xxxx" @input="format_number('first')">
            </div>

            <div class="div-style">
                <label>Type</label>
                <select v-model="new_contact.numbers[0].type">
                    <option v-for="option in type_options" :value="option.value">{{ option.label }}</option>
                </select>
            </div>

            <p v-if="CGIsError" style="color: red;">Custom groups fetch failed D:</p>
            <div v-if="CGIsSuccess" class="div-style">
                <label>Choose group</label>
                <span style="color: red;" v-if="!userCustomGroups?.result">Custom groups fetch failed D:</span>
                <select v-else @change="e => handle_select_group(e, 'first')">
                    <option :value="null" selected disabled>Choose...</option>
                    <option v-if="!userCustomGroups?.custom_groups?.length" :value="null">No results found.</option>
                    <option v-else v-for="group in userCustomGroups?.custom_groups" :value="group?.id">{{ group?.group_name }}</option>
                </select>
            </div>

            <div class="div-style">
                <label for="notes">Notes group</label>
                <textarea v-model="new_contact.numbers[0].notes" id="notes" cols="50" rows="5" placeholder="Enter your message..."></textarea>
            </div>

            <button type="button" class="button is-primary" @click="handle_add_another">+ Add another number</button>

            <!-- Second form  -->
            <div v-if="show_second_form">
                <div class="div-style">
                    <label for="second-phone">Phone (Ext)</label>
                    <input type="text" id="second-phone" v-model="new_contact.numbers[1].number" placeholder="(xxx) xxx - xxxx" @input="format_number('second')">
                </div>

                <div class="div-style">
                    <label>Type</label>
                    <select v-model="new_contact.numbers[1].type">
                        <option v-for="option in type_options" :value="option.value">{{ option.label }}</option>
                    </select>
                </div>

                <p v-if="CGIsError" style="color: red;">Custom groups fetch failed D:</p>
                <div v-if="CGIsSuccess" class="div-style">
                    <label>Choose group</label>
                    <span style="color: red;" v-if="!userCustomGroups?.result">Custom groups fetch failed D:</span>
                    <select v-else @change="e => handle_select_group(e, 'second')">
                        <option :value="null" selected disabled>Choose...</option>
                        <option v-if="!userCustomGroups?.custom_groups?.length" :value="null">No results found.</option>
                        <option v-else v-for="group in userCustomGroups?.custom_groups" :value="group?.id">{{ group?.group_name }}</option>
                    </select>
                </div>

                <div class="div-style">
                    <label for="notes">Notes group</label>
                    <textarea v-model="new_contact.numbers[1].notes" id="notes" cols="50" rows="5" placeholder="Enter your message..."></textarea>
                </div>
            </div>

            <button class="save-btn" type="button" @click="save_contact">Save</button>
        </form>
        <p v-if="isSuccess" style="color: green;">All good :D</p>

        <p style="color: green;" v-if="isPending">Saving...</p>
        <p style="color: red;" v-if="isError">Something went wrong.</p>
        
    </div>
</template>

<script setup lang="ts">
    const show_second_form = ref(false)

    const empty_contact: ContactToSave = {
        first_name: '',
        last_name: '',
        numbers: [{
            id: 'new',
            number: '',
            notes: '',
            type: '4',
            number_groups: null
        }] 
    }
    const new_contact = reactive<ContactToSave>({...empty_contact})

    const type_options = [
        { value: '4', label: 'Home' },
        { value: '1', label: 'Mobile' },
        { value: '2', label: 'Office' },
        { value: '3', label: 'Other' }
    ]

    const { data: userCustomGroups, isSuccess: CGIsSuccess, isError: CGIsError } = useFetchUserCustomGrups()
    const { mutate: saveContact, isPending, isError, isSuccess } = useSaveContact()

    const format_number = (form: string) => {
        const regex = /^\d{0,10}$/;

        if(form === 'first' && !regex.test(new_contact.numbers[0].number)) {
            new_contact.numbers[0].number = new_contact.numbers[0].number.slice(0, 10)
        }
        if(form === 'second' && !regex.test(new_contact.numbers[1].number)) {
            new_contact.numbers[1].number = new_contact.numbers[1].number.slice(0, 10)
        }
    }

    const handle_select_group = (e: Event, form: string) => {
        const target = e.target as HTMLSelectElement
        if(form === 'first') new_contact.numbers[0].number_groups = [target.value]
        if(form === 'second') new_contact.numbers[1].number_groups = [target.value]
    }

    const handle_add_another = () => {
        show_second_form.value = true
        new_contact.numbers.push({
            id: 'new',
            number: '',
            notes: '',
            type: '4',
            number_groups: null
        })
    }
    
    const save_contact = () => {
        const data_to_send: ContactToSaveData = {
            action: 'create',
            contact_info: new_contact,
            save_contact: true
        }
        
        saveContact(data_to_send)
    }
</script>

<style scoped>
    .text-title {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }
    .div-style {
        margin: 1.5rem 0;
        display: flex;
        gap: 6px;
    }
    .div-style label {
        width: 100px;
        text-align: right;
    }
    .save-btn {
        padding: .5rem 1rem;
        display: block;
        margin-top: 1rem;
        background-color: #4f92ef;
        color: white;
        font-weight: bold;
    }
    .save-btn:hover {
        cursor: pointer;
        background-color: #3f81df;
    }
</style>