<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import {
  FormSchema,
  getErrors,
  getFieldError,
  type FormFields,
  type FormFieldErrors,
} from "../schemas/TheForm";
import { ref, reactive } from "vue";

const availabilityResponse = reactive({
  available: false,
  unavailableFrom: false,
});

const objects = [
  { id: 1, name: "Object 1" },
  { id: 2, name: "Object 2" },
  { id: 3, name: "Object 3" },
];

const formSubmitted = ref(false);
const formErrors = reactive<FormFieldErrors>({});
const formState = reactive({
  startDate: "",
  endDate: "",
  selectedObject: "",
});

const checkAvailability = () => {
  // Hier zouden we normaal gesproken een echte API call doen
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simuleer een response
      const unavailableFrom =
        formState.selectedObject === "Object 2" ? "2024-10-10" : null;
      resolve({
        status: 200,
        data: {
          unavailableFrom: unavailableFrom,
        },
      });
    }, 1000);
  });
};

const onSubmit = async () => {
  formSubmitted.value = true;
  const { error } = FormSchema.safeParse(formState);
  if (error) {
    Object.entries(getErrors(error)).forEach(([key, value]) => {
      formErrors[key as FormFields] = value;
    });
  }

  // Simuleer API call naar de server voor beschikbaarheidscontrole
  checkAvailability().then((response) => {
    availabilityResponse.available = response.data.unavailableFrom === null;
    availabilityResponse.unavailableFrom = response.data.unavailableFrom;
  });
};

const onBlur = (property: FormFields) => {
  const message = getFieldError(property, formState[property]);
  formErrors[property] = message;
};

const isInvalid = (property: FormFields) => {
  if (formSubmitted.value) {
    return !!formErrors[property];
  }
  return undefined; // Do not add aria-invalid attribute if not touched
};
</script>

<template>
  <div>
    <form @submit.prevent="onSubmit">
      <div class="field">
        <label for="object">Object</label>
        <div>
          <select
            required
            v-model="formState.selectedObject"
            @blur="onBlur('selectedObject')"
            :aria-invalid="isInvalid('selectedObject')"
          >
            <option value="" disabled>Selecteer object</option>
            <option
              v-for="object in objects"
              :key="object.id"
              :value="object.name"
            >
              {{ object.name }}
            </option>
          </select>

          <span v-if="formErrors.selectedObject" class="error">{{
            formErrors.selectedObject
          }}</span>
        </div>
      </div>

      <div class="field">
        <label for="start-date">Start date</label>
        <VueDatePicker
          required
          v-model="formState.startDate"
          placeholder="Select start date"
          @blur="onBlur('startDate')"
          :aria-invalid="isInvalid('startDate')"
        />
        <span v-if="formErrors.startDate" class="error">{{
          formErrors.startDate
        }}</span>
      </div>

      <div class="field">
        <label for="end-date">End date</label>
        <VueDatePicker
          required
          v-model="formState.endDate"
          placeholder="Select end date"
          @blur="onBlur('endDate')"
          :aria-invalid="isInvalid('endDate')"
        />
        <span v-if="formErrors.endDate" class="error">{{
          formErrors.endDate
        }}</span>
      </div>
      <button type="submit">Check availability</button>
    </form>
    <p v-if="availabilityResponse.available">Object is available to rent!</p>
    <p v-if="availabilityResponse.unavailableFrom">
      Object is available from: {{ availabilityResponse.unavailableFrom }}
    </p>
  </div>
</template>

<style scoped>
.error {
  color: red;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

.field {
  margin-bottom: 1rem;
}
</style>
