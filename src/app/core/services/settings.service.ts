import { computed, Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { IAdmin } from "../modals/admin";

@Injectable({
  providedIn: 'root',
})

export class SettingsService {

  adminInfo: WritableSignal<IAdmin> = signal({
    id: "",
    full_name: "",
    image: null,
    email: "",
    status: "",
    mobile: "",
  });
  adminSettings: Signal<IAdmin> = computed(() => this.adminInfo());
}
