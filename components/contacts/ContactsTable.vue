<template>
    <div class="flex justify-center items-center w-full table-container">
        

        <DataTable :value="dataToShow" tableStyle="min-width: 50rem" class="contacts-table p-5 w-full rounded-7">
            <header class="table-header flex justify-between items-center">
                <input type="text">
                <div class="flex">
                    <Button class="table-action-btn flex items-center p-2 rounded-2" label="Filter">
                        <template #icon>
                            <FilterSVG />
                        </template>
                    </Button>
                    <Button class="table-action-btn flex items-center p-2 rounded-2" label="Sort by">
                        <template #icon>
                            <SortBySVG />
                        </template>
                    </Button>
                </div>
            </header>
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header"></Column>
        </DataTable>
    </div>
    
</template>

<script setup lang="ts">

    const dataToShow = [
        { name: 'John Doe', number: '123-456-7890', group: '2', dnc: 'Yes' },
        { name: 'Pedro Pascal', number: '123-456-7890', group: '2', dnc: 'No' },
        { name: 'Eduardo Ledesma Higonet', number: '123-456-7890', group: '1', dnc: 'Yes' },
        { name: 'Dibu Martinez', number: '123-456-7890', group: '1', dnc: 'No' },
    ]


    const columns = [
        { field: 'name', header: 'Name' },
        { field: 'number', header: 'Phone' },
        { field: 'group', header: 'Groups' },
        { field: 'dnc', header: 'DNC' },
    ];
</script>

<style scoped lang="scss">
    .table-container {
        max-width: 850px;
        max-height: 780px;
    }

    .contacts-table {
        background-color: white;
        font-size: 14px;
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    }

    .table-header {

    }
    
    .table-action-btn {
        background-color: transparent;
        border: none;
        gap: 6px;
        transition: background-color 0.3s;

        &:hover {
            cursor: pointer;
            background-color: #F5F5F5;
        }
    }
</style>