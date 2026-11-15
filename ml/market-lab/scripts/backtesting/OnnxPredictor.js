// SingleOnnxPredictor.js
import * as fs from 'fs/promises';
import * as ort from 'onnxruntime-node';

/**
 * OnnxPredictor
 *
 * Utility class for loading and running ONNX models with pre-scaling.
 *
 * - Loads ONNX model with onnxruntime-node.
 * - Preprocesses input data with StandardScaler parameters (mean/scale).
 * - Supports dynamic detection of input/output names from model metadata.
 * - Provides simple async predict(row) for single-sample inference.
 *
 * Usage example:
 *   const predictor = await SingleOnnxPredictor.load({ modelPath, scalerPath });
 *   const result = await predictor.predict({ rsi: 50, ema: 2000, atr: 15, obv: 10000 });
 */
export default class OnnxPredictor {
  constructor(session, scaler) {
    this.session = session;               // ONNX runtime session (loaded model)
    this.features = scaler.features;      // list of feature names
    this.mean = Float64Array.from(scaler.mean);   // feature-wise means from StandardScaler
    this.scale = Float64Array.from(scaler.scale); // feature-wise scales from StandardScaler

    // Dynamically detect input and output names from ONNX session metadata
    const inputNames = session.inputNames ?? Object.keys(session.inputMetadata ?? {});
    this.inputName = inputNames[0]; // assume first input is the main one
    const outputNames = session.outputNames ?? Object.keys(session.outputMetadata ?? {});
    this.outputName = outputNames[0]; // assume first output is the main one
  }

  _preprocess(row) {
    /**
     * Preprocess a single input row (dictionary of feature values).
     * - Ensures required features exist
     * - Standardizes values: (x - mean) / scale
     * - Returns Float32Array suitable for ONNX model input
     */
    const F = this.features.length;
    const buf = new Float32Array(F);

    for (let f = 0; f < F; f++) {
      const key = this.features[f];
      if (!(key in row)) throw new Error(`Feature "${key}" not found in row`);
      const v = +row[key]; // convert to number
      if (!Number.isFinite(v)) throw new Error(`Bad value for "${key}": ${row[key]}`);
      buf[f] = (v - this.mean[f]) / (this.scale[f] + 1e-12); // standardization
    }
    return buf;
  }

  async predict(row) {
    /**
     * Run prediction for a single row of input data.
     * - Preprocess input
     * - Create ONNX Tensor
     * - Run model session
     * - Extract and return first output value
     */
    const inputData = this._preprocess(row);
    const tensor = new ort.Tensor('float32', inputData, [1, this.features.length]);
    const out = await this.session.run({ [this.inputName]: tensor });
    const outTensor = out[this.outputName] ?? Object.values(out)[0];
    return outTensor.data[0]; // single numeric prediction
  }

  static async load({ modelPath, scalerPath }) {
    /**
     * Static factory method to create predictor instance:
     * - Loads scaler parameters (JSON) with mean/scale/features
     * - Loads ONNX model file
     * - Creates inference session with CPU execution provider
     */
    const scaler = JSON.parse(await fs.readFile(scalerPath, 'utf8'));
    const modelBytes = await fs.readFile(modelPath);
    const session = await ort.InferenceSession.create(modelBytes, {
      executionProviders: ['cpu'],
    });
    return new SingleOnnxPredictor(session, scaler);
  }
}