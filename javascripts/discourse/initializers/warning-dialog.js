import { withPluginApi } from "discourse/lib/plugin-api";
import { inject as service } from "@ember/service";

export default {
  name: "discourse-admin-warnings",

  initialize() {
    withPluginApi("0.11.7", (api) => {
      api.modifyClass("controller:topic", {
        pluginId: "discourse-admin-warnings",
        dialog: service(),
        actions: {
          replyToPost(post, skipWarning = false) {
            let lastPostedAt = moment(this.get('model.last_posted_at'));
            let now = moment();
            let diff = now - lastPostedAt;
            let d = moment.duration(settings.death_timer);

            if((diff >= d) && !skipWarning) {
              // TODO: i18n this
              let diffH = moment.duration(diff).humanize();
              let confirmationMessage = `The last post in this thread was ${diffH} ago. Are you sure you want to bump this thread?`;
              this.dialogue.yesNoConfirm({
                message: confirmationMessage,
                didConfirm: () => {
                  this.send("replyToPost", post, true);
                }
              });
            } else {
              return this._super(post);
            }
          },
        },
      });
    });
  },
};
