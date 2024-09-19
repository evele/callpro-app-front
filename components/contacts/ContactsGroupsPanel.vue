<template>
    <section class="container flex flex-col">
        <div class="first-section">
            <h4 class="groups-title">Groups</h4>

            <ul class="flex flex-col default-groups-ul">
                <li class="fake-button"></li>
                <li class="fake-button"></li>
                <li class="fake-button"></li>
            </ul>
        </div>

        <Divider class="divider" />

        <div class="second-section flex flex-col">
            <div class="fake-button"></div>
            <ul class="user-group-container flex flex-col">
                <li class="flex justify-end" v-for="group in USER_GROUPS" :key="group.number">
                    <Button class="user-group-btn flex justify-between items-center" :class="group.bgColor">
                        <div class="flex items-center user-group-data">
                            <span class="user-group-name">{{ group.name }}</span>
                            <span class="user-group-number">#{{ group.number }}</span>
                        </div>
                        <EditIconSVG />
                    </Button>
                </li>
            </ul>
        </div>

        <Button class="add-new-btn mx-auto">
            <PlusSVG class="plus-icon" />
            <span class="add-new-text">Add new</span>
        </Button>
    </section>
</template>

<script setup lang="ts">
    import EditIconSVG from "@/components/svgs/EditIconSVG.vue"

    const USER_GROUPS = [
        { name: "Group 1", number: "0054", bgColor: "bg-green" },
        { name: "Group 2", number: "0044", bgColor: "bg-yellow" },
        { name: "Group 3", number: "0034", bgColor: "bg-red" },
    ]
</script>

<style scoped lang="scss">
    .container {
        max-width: 250px; 
        min-height: 500px;
        border-radius: 16px;
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
        overflow: hidden;
        background-color: #FFF;
        gap: 12px;
        padding: 28px 0 0 0;

        .first-section {
            padding: 0 16px;
        }

        .divider {
            background: #CAC4D0;
            height: 0.5px;
        }

        .second-section {
            padding: 0 16px;
            gap: 10px;
        }
    }

    .groups-title {
        font-size: 20px;
        font-weight: 600;
        line-height: 140%;
    }
    
    .default-groups-ul {
        gap: 6px;
        list-style: none;
        padding: 0;
        text-align: end;
    }

    .fake-button {
        width: 100%;
        height: 50px;
        border-radius: 10px;
        background-color: #F4F0EF;
    }

    .user-group-container {
        max-height: 94px;
        overflow-y: scroll;
        gap: 5px;
        padding: 0;
    }

    .user-group-btn {
        width: 94%;
        border-radius: 10px;
        height: 35px;
        border: none;
        padding: 10px 12px;
        gap: 8px;

        .user-group-data {
            gap: 4px;

            .user-group-name {
                font-size: 14px;
                font-weight: 500;
                line-height: 140%;
                color: #1D192B;
            }

            .user-group-number {
                color: #79747E;
                font-size: 12px;
                font-style: italic;
                line-height: 140%;
            }
        }
    }

    .bg-green {
        background-color: #EBFFEE;
    }
    .bg-yellow {
        background-color: #FFFBEB;
    }
    .bg-red {
        background-color: #FEE9E7;
    }

    .add-new-btn {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        color: #FFF;
        width: 180px;
        height: 45px;
        padding: 10px 0;
        margin-top: 10px;
        gap: 8px;
        border-radius: 18px;
        background-color: #1D192B;
        box-shadow: 0px 0.9px 1.8px 0px rgba(0, 0, 0, 0.30), 0px 1.8px 5.4px 1.8px rgba(0, 0, 0, 0.15);

        &:hover {
            cursor: pointer;
        }

        .plus-icon {
            position: absolute;
            left: 40%; 
            top: 50%;
            transform: translateY(-50%);
            transition: left 0.3s ease;
        }

        .add-new-text {
            position: absolute;
            min-width: 80px;
            left: 50%;
            opacity: 0;
            transition: left 0.3s ease, opacity 0.3s ease;
        }

        &:hover .plus-icon {
            left: 20%;
        }

        &:hover .add-new-text {
            left: 37%;
            opacity: 1;
        }
    }
</style>