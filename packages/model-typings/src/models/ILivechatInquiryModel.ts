import type {
	IMessage,
	ILivechatInquiryRecord,
	LivechatInquiryStatus,
	OmnichannelSortingMechanismSettingType,
} from '@rocket.chat/core-typings';
import type { FindOptions, DistinctOptions, Document, UpdateResult, DeleteResult, FindCursor, DeleteOptions } from 'mongodb';

import type { IBaseModel } from './IBaseModel';

export interface ILivechatInquiryModel extends IBaseModel<ILivechatInquiryRecord> {
	findOneQueuedByRoomId(rid: string): Promise<(ILivechatInquiryRecord & { status: LivechatInquiryStatus.QUEUED }) | null>;
	findOneByRoomId<T extends Document = ILivechatInquiryRecord>(
		rid: string,
		options?: FindOptions<T extends ILivechatInquiryRecord ? ILivechatInquiryRecord : T>,
	): Promise<T | null>;
	findOneReadyByRoomId<T extends Document = ILivechatInquiryRecord>(
		rid: string,
		options?: FindOptions<T extends ILivechatInquiryRecord ? ILivechatInquiryRecord : T>,
	): Promise<T | null>;
	getDistinctQueuedDepartments(options: DistinctOptions): Promise<(string | undefined)[]>;
	setDepartmentByInquiryId(inquiryId: string, department: string): Promise<ILivechatInquiryRecord | null>;
	setLastMessageByRoomId(rid: ILivechatInquiryRecord['rid'], message: IMessage): Promise<ILivechatInquiryRecord | null>;
	findNextAndLock(queueSortBy: OmnichannelSortingMechanismSettingType, department?: string): Promise<ILivechatInquiryRecord | null>;
	unlock(inquiryId: string): Promise<UpdateResult>;
	unlockAndQueue(inquiryId: string): Promise<UpdateResult>;
	unlockAll(): Promise<UpdateResult | Document>;
	getCurrentSortedQueueAsync(props: {
		inquiryId?: string;
		department?: string;
		queueSortBy: OmnichannelSortingMechanismSettingType;
	}): Promise<(Pick<ILivechatInquiryRecord, '_id' | 'rid' | 'name' | 'ts' | 'status' | 'department'> & { position: number })[]>;
	removeByRoomId(rid: string, options?: DeleteOptions): Promise<DeleteResult>;
	getQueuedInquiries(options?: FindOptions<ILivechatInquiryRecord>): FindCursor<ILivechatInquiryRecord>;
	takeInquiry(inquiryId: string): Promise<void>;
	openInquiry(inquiryId: string): Promise<UpdateResult>;
	queueInquiry(inquiryId: string): Promise<ILivechatInquiryRecord | null>;
	queueInquiryAndRemoveDefaultAgent(inquiryId: string): Promise<UpdateResult>;
	readyInquiry(inquiryId: string): Promise<UpdateResult>;
	changeDepartmentIdByRoomId(rid: string, department: string): Promise<void>;
	getStatus(inquiryId: string): Promise<ILivechatInquiryRecord['status'] | undefined>;
	updateVisitorStatus(token: string, status: ILivechatInquiryRecord['v']['status']): Promise<UpdateResult>;
	setDefaultAgentById(inquiryId: string, defaultAgent: ILivechatInquiryRecord['defaultAgent']): Promise<UpdateResult>;
	setNameByRoomId(rid: string, name: string): Promise<UpdateResult>;
	findOneByToken(token: string): Promise<ILivechatInquiryRecord | null>;
	removeDefaultAgentById(inquiryId: string): Promise<UpdateResult | Document>;
	removeByVisitorToken(token: string): Promise<void>;
	markInquiryActiveForPeriod(rid: ILivechatInquiryRecord['rid'], period: string): Promise<ILivechatInquiryRecord | null>;
	findIdsByVisitorToken(token: ILivechatInquiryRecord['v']['token']): FindCursor<ILivechatInquiryRecord>;
	setStatusById(inquiryId: string, status: LivechatInquiryStatus): Promise<ILivechatInquiryRecord>;
	updateNameByVisitorIds(visitorIds: string[], name: string): Promise<UpdateResult | Document>;
	findByVisitorIds(visitorIds: string[], options?: FindOptions<ILivechatInquiryRecord>): FindCursor<ILivechatInquiryRecord>;
}
