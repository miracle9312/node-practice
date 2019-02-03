<template>
    <div>
        <h1>Miralce's App</h1>
        <span>version: {{this.version}}</span>
    </div>
</template>

<script>
    import axios from "axios"
    export default {
        name: "App",
        data() {
            return {
                version: ""
            }
        },
        created() {
            axios.get("/api/version").then((data) => {
                if(data && data.status === 200) {
                    this.version = data.data
                }
            })
        }
    }
</script>

<style scoped>

</style>