import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const pageSchema = new mongoose.Schema({
  pageId: Schema.Types.UUID,
  offset: Number
})

const Page = mongoose.model("Page", pageSchema);

export const textSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'Untitled Document'
  },
  textContent: {
    lineIds: [Schema.Types.UUID],
    lines: {
      type: Map,
      of: new mongoose.Schema({
        text: { type: String, required: true }
      }, { _id: false })
    },
    currLine: Number
  },
  pages: {
    type: [Schema.Types.ObjectId],
    ref: 'Page'
  }

})

//const Text = mongoose.model("Text", textSchema);
