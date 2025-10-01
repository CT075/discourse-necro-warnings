import { withPluginApi } from "discourse/lib/plugin-api";
import { inject as service } from "@ember/service";

export default {
  name: "discourse-necro-warnings",

  initialize() {
    withPluginApi("0.11.7", (api) => {
      api.modifyClass("service:composer", (Super) => class extends Super {
        save(...args) {
          let lastPostedAt = moment(this.model.last_posted_at);
          let now = moment();
          let diff = now - lastPostedAt;
          let d = moment.duration(settings.death_timer);

          if((diff >= d) && !skipWarning) {
            // TODO: i18n this
            let diffH = moment.duration(diff).humanize();
            let confirmationMessage = `The last post in this thread was ${diffH} ago. Are you sure you want to bump this thread?`;
            this.dialog.yesNoConfirm({
              message: confirmationMessage,
              didConfirm: () => {
                this.send("replyToPost", post, true);
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
