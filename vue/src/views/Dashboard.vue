<template>
    <div id="page-dashboard">
        <v-row justify="center">
            <v-col cols="12" class="text-center">
                <span class="text-center display-3">Dashboard</span>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    // @ is an alias to /src


    export default {
        name: 'team',
        components: {},
        data: () => ({
            team: [
                {name: 'Iyad', role: 'web developer', avatar: '/img1.png'},
                {name: 'Reda', role: 'Graphic designer', avatar: '/img2.png'},
                {name: 'Zineb', role: 'web developer', avatar: '/img3.png'},
                {name: 'Hu TechGroup', role: 'Desktop developer', avatar: '/img4.png'},
            ]
        }),
    }
</script>
