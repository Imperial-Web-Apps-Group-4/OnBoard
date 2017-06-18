<template>
    <figure class="board-area" v-bind:class="{ 'focus': selectedComponentID != undefined }">
        <game-component v-for="(component, compID) in game.components"
        :id="compID" :component="component"
        :componentClass="game.manifest.componentClasses[component.classID]"
        :key="compID"
        v-bind:selected="compID == selectedComponentID">
        </game-component>
        <div class="recycle-bin">
            <i class="material-icons">delete</i>
        </div>
    </figure>
</template>

<script>

</script>
