<template>
    <div>
        <h1>Miralce's App</h1>
        <span>version: {{this.version}}</span>
        <div>
            <h2>search result:</h2>
            <span v-for="book in bookSearch">
                {{book.title}}
            </span>
        </div>
    </div>
</template>

<script>
    import axios from "axios"
    export default {
        name: "App",
        data() {
            return {
                version: "",
                bookSearch: []
            }
        },
        created() {
            axios.get("/api/version").then((data) => {
                if(data && data.status === 200) {
                    this.version = data.data
                }
            });
            // 搜索关键词
            axios.get("/api/search/books/authors/Lowell").then(data => {
                if(data && data.status === 200) {
                    this.bookSearch = data.data;
                }
            });
            // 搜索词联想
            axios.get("/api/suggest/authors/lipman").then(data=> {
                console.log(data);
            })
        }
    }
</script>

<style scoped>

</style>