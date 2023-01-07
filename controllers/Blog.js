import BlogModel from "../models/BlogModel.js";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export const getBlogs = async (req, res) => {
  try {
    const response = await BlogModel.findAll();
    res.status(200).send(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getBlogById = async (req, res) => {
  try {
    const response = await BlogModel.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).send(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const createBlog = async (req, res) => {
  const { title, body, author, category } = req.body;

  if (req.files === null)
    return res.status(400).json({ msg: "File gambar harus ada" });

  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = uuidv4() + ext;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const allowedType = [".jpg", ".jpeg", ".png", ".webp"];

  if (!allowedType.includes(ext.toLocaleLowerCase()))
    return res.status(422).json({ msg: "Gambar tidak didukung" });
  if (fileSize > 1000000)
    return res.status(422).json({ msg: "Gambar harus kurang dari 1 MB" });

  file.mv(`./public/images/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      await BlogModel.create({
        title: title,
        body: body,
        author: author,
        category: category,
        image: fileName,
        url: url,
      });

      res.status(201).json({ msg: "Berhasil membuat blog" });
    } catch (error) {
      console.log(error.message);
    }
  });
};

export const updateBlog = async (req, res) => {
  const blog = await BlogModel.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!blog) return res.status(404).json({ msg: "Tidak ada data blog" });

  let fileName = "";
  console.log(req.files);
  if (req.files === null) {
    fileName = blog.image;
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = uuidv4() + ext;
    const allowedType = [".jpg", ".png", ".jpeg"];

    if (!allowedType.includes(ext.toLocaleLowerCase()))
      return res.status(422).json({ msg: "Gambar tidak didukung" });
    if (fileSize > 1000000)
      return res.status(422).json({ msg: "Gambar harus kurang dari 1 MB" });

    //menghapus file image jika di update dengan image
    const filepath = `./public/images/${blog.image}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }

  const { title, body, author, category } = req.body;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

  try {
    await BlogModel.update(
      {
        title: title,
        image: fileName,
        url: url,
        body: body,
        author: author,
        category: category,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: "Blog telah di perbarui" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteBlog = async (req, res) => {
  const blog = await BlogModel.findOne({
    where: {
      id: req.params.id,
    },
  });

  try {
    // menghapus image di database
    const filepath = `./public/images/${blog.image}`;
    fs.unlinkSync(filepath);

    await BlogModel.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({ msg: "Blog berhasil dihapus" });
  } catch (error) {
    console.log(error.message);
  }
};
