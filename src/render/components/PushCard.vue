<template>
    <div>
        <div>日灵: {{ sunSpirit }}</div>
        <div>月灵: {{ moonSpirit }}</div>
        <button @click="useSkill('幽月轮')">幽月轮</button>
        <button @click="useSkill('赤日轮')">赤日轮</button>
        <button :disabled="isCooldown('烈日斩')" @click="useSkill('烈日斩')">烈日斩</button>
        <button :disabled="isCooldown('银月斩')" @click="useSkill('银月斩')">银月斩</button>
        <button @click="useSkill('净世破魔击')">净世破魔击</button>
        <button @click="useSkill('生死劫')">生死劫</button>
    </div>
</template>
  
<script>
import { ref } from 'vue';

export default {
    setup() {
        const sunSpirit = ref(0);
        const moonSpirit = ref(0);
        const cooldowns = ref({ '烈日斩': false, '银月斩': false });

        const useSkill = (skill) => {
            switch (skill) {
                case '幽月轮':
                    moonSpirit.value = Math.min(moonSpirit.value + 20, 100);
                    break;
                case '赤日轮':
                    sunSpirit.value = Math.min(sunSpirit.value + 20, 100);
                    break;
                case '烈日斩':
                    if (!cooldowns.value['烈日斩']) {
                        sunSpirit.value = Math.min(sunSpirit.value + 40, 100);
                        triggerCooldown('烈日斩');
                    }
                    break;
                case '银月斩':
                    if (!cooldowns.value['银月斩']) {
                        moonSpirit.value = Math.min(moonSpirit.value + 40, 100);
                        triggerCooldown('银月斩');
                    }
                    break;
                case '净世破魔击':
                    if (moonSpirit.value >= 100 || sunSpirit.value >= 100) {
                        sunSpirit.value = 20;
                        moonSpirit.value = 20;
                    }
                    break;
                case '生死劫':
                    if (moonSpirit.value >= 100 || sunSpirit.value >= 100) {
                        sunSpirit.value = 0;
                        moonSpirit.value = 0;
                    }
                    break;
            }
        };

        const triggerCooldown = (skill) => {
            cooldowns.value[skill] = true;
            setTimeout(() => {
                cooldowns.value[skill] = false;
            }, 5000);
        };

        const isCooldown = (skill) => {
            return cooldowns.value[skill];
        };

        return { sunSpirit, moonSpirit, useSkill, isCooldown };
    }
};
</script>
  