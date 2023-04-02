import { Context } from "hono";
import { BaseManageUpload } from "../../components/manage/upload.js";
import { Base } from "../../components/_base/base.js";
import { PomdexAccounts } from "../../modules/database/init.js";

export default async (c: Context) => {
	if (
		!c.req.cookie("pomdexAccount") ||
		(
			await PomdexAccounts.findOne({
				token: c.req.cookie("pomdexAccount"),
			})
		)?.type !== "admin"
	) {
		return c.redirect("/user/login");
	}

	return c.html(
		<Base title={`Editting: New Entry`}>
			<BaseManageUpload />
		</Base>
	);
};
