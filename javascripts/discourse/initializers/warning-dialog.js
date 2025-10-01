import { withPluginApi } from "discourse/lib/plugin-api";
import { inject as service } from "@ember/service";

export default {
  name: "discourse-necro-warnings",
  initialize() {
    withPluginApi("0.8.8", (api) => {
      api.modifyClass("service:composer", (Superclass) => class extends Superclass {
        save(...args) {
          console.log(this.model.last_posted_at)
          let lastPostedAt = moment(this.model.last_posted_at);
          let now = moment();
          let diff = now - lastPostedAt;
          console.log(diff)
          let d = moment.duration(settings.death_timer);

          if((diff >= d) && !skipWarning) {
            // TODO: i18n this
            let diffH = moment.duration(diff).humanize();
            let confirmationMessage = `The last post in this thread was ${diffH} ago. Are you sure you want to bump this thread?`;
            this.dialog.yesNoConfirm({
              message: confirmationMessage,
              didConfirm: () => {
                super.save(...args)
              }
            });
          } else {
            super.save(...args);
          }
        }
      });
    });
  },
};
