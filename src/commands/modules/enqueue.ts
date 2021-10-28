import { AudioInterface } from 'bot-classes';
import { getVideoDetails } from 'bot-functions';
import { CommandHandler } from '../CommandHandler.types';

const enqueue: CommandHandler = async interaction => {
	try {
		if (!interaction.guild) {
			return;
		}

		await interaction.deferReply({ ephemeral: true });
		const audioInterface = AudioInterface.getInterfaceForGuild(interaction.guild);
		const youtubeUrl = interaction.options.getString('youtube-url', true);
		const videoDetails = await getVideoDetails(youtubeUrl);

		if (!videoDetails) {
			await interaction.editReply('🚨 I could not add that item to the queue. Is it a valid URL? Is it age restricted or private?');
			return;
		}

		const appended = await audioInterface.queueAppend(youtubeUrl);

		if (appended) {
			await interaction.editReply(`✅ Enqueued \`${videoDetails.videoDetails.title}\`.`);
		} else {
			await interaction.editReply('🚨 I could not add that item to the queue. Is it a valid URL?');
		}
	} catch (error) {
		console.error(error);
	}
};

export default enqueue;
