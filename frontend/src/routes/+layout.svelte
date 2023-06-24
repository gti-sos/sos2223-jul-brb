<script>
    import Footer from './Footer.svelte';
    import Header from './Header.svelte';
    import './style.css';
</script>

<main>
    <Header></Header>
    <slot></slot>
    <div class="clear"></div>
    <Footer></Footer>
</main>