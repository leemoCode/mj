import { ref, Ref } from 'vue';

interface useDataInterface {
    demoData: Ref<any[]>;
}

const demoData = ref<any[]>([]);


export const useData: () => useDataInterface = function () {
    return {
        demoData,
    };
};
