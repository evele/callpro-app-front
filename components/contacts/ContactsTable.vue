<template>
    <div class="w-full table-container rounded-7 py-4 pl-4 px-2">
        <DataTable :value="dataToShow" tableStyle="min-width: 40rem" class="contacts-table w-full flex flex-col gap-18">

            <template #header>
                <header class="flex flex-col w-full gap-18">
                    <div class="flex justify-between items-center w-full">
                        <div class="search-input-container">
                            <SearchSVG class="search-icon" />
                            <InputText type="text" placeholder="Search by Name, Phone or Group" class="search-input rounded-8" />
                        </div>

                        <div class="flex gap-4">
                            <Button class="table-action-btn flex items-center py-2 px-3 rounded-9 gap-6" label="Filter">
                                <template #icon>
                                    <FilterSVG class="table-action-icon" />
                                </template>
                            </Button>
                            <Button class="table-action-btn flex items-center py-2 px-3 rounded-9 gap-6" label="Sort by">
                                <template #icon>
                                    <SortBySVG class="table-action-icon" />
                                </template>
                            </Button>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-4 selected-group-info rounded-4">
                        <CheckSVG class="check-icon rounded-full" />
                        <span>All</span>
                    </div>
                </header>
            </template>

            <Column selectionMode="multiple" headerStyle="text-align: left"></Column>
            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header"
                :class="{'left-aligned-column': col.field === 'name', 'center-aligned-column': col.field !== 'name'}"
            ></Column>
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
        background-color: white;
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
        font-size: 14px;
    }
    
    .table-action-btn {
        background-color: transparent;
        border: none;
        transition: background-color 0.3s;
        font-weight: 600;

        &:hover {
            cursor: pointer;
            background-color: #F5F5F5;
        }
    }

    .table-action-icon {
        color: #757575;
    }

    .search-input-container {
        position: relative;
        display: inline-block;
    }

    .search-icon {
        position: absolute;
        left: 10px; 
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
    }

    .search-input {
        border: 1px solid #DED8E1;
        padding: 2px 10px 2px 35px;
        width: 280px;
        height: 38px;
    }

    .selected-group-info {
        background-color: #e1daf0;
        padding: 4px 8px;
        border-bottom: 1px solid #ccc;
        width: fit-content;
        color: black;
    }

    .check-icon {
        background-color: #65558F;
        color: white;
        width: 17.143px;
        height: 17.143px;
        padding: 1px;
    }
    

    // .contacts-table td {
    //     text-align: center;
    //     vertical-align: middle;
    // }
</style>