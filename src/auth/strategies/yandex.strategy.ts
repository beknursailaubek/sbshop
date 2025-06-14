import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-yandex'

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
	constructor(private configService: ConfigService) {
		super({
			clientID: configService.getOrThrow<string>('YANDEX_CLIENT_ID'),
			clientSecret: configService.getOrThrow<string>(
				'YANDEX_CLIENT_SECRET'
			),
			callbackURL:
				configService.getOrThrow<string>('SERVER_URL') +
				'/auth/yandex/callback'
		})
	}

	async validate(
		_accessToken: string,
		_refreshToken: string,
		profile: Profile,
		done: any
	): Promise<any> {
		const { username, emails, photos } = profile

		const email = emails?.[0].value
		const picture = photos?.[0]?.value

		const user = {
			email,
			name: username,
			picture
		}

		done(null, user)
	}
}
