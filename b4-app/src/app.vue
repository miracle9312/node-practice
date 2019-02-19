<template>
    <div>
        <h1>Miralce's App</h1>
        <span>version: {{this.version}}</span>
        <div>
            <h2>My Book Bundles:</h2>
            <div v-for="bundle in bundles">
                {{bundle.name}}
            </div>
        </div>
    </div>
</template>

<script>
    import axios from "axios";
    export default {
        name: "App",
        data() {
            return {
                version: "",
                bookSearch: [],
                bundles: []
            }
        },
        created() {
            // 获取书单
            axios.get("es/b4/bundle/_search?size=1000").then(data => {
                if(data.data && data.status === 200) {
                    const bundles = data.data;
                    this.bundles = bundles.hits.hits.map(hit => ({
                        id: hit.id,
                        name: hit._source.name
                    }));
                }
            });
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
                // console.log(data);
            })
        }
    }
</script>

<style scoped>

</style>