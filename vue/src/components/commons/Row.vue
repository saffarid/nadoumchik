<template>
    <div class="row">
        <slot></slot>
    </div>
</template>

<script>

    /**
     * Компонент-строка, адаптирует положение
     * активного элемента таким образом,
     * что он всегда располагается по центру окна браузера.
     * */
    export default {
        name: 'Row',
    }
</script>

<style>

    .row {
        display: grid;
        grid-template-columns: repeat(2, minmax(150px, 300px));
        column-gap: 5px;
        align-content: center;
        align-items: center;
    }

    .row label {
        align-self: center;
        justify-self: end;
    }

    .row input {
        justify-self: stretch;
    }

    .optional {
        grid-column-end: span 2;
    }

</style>